

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

class POSBSchemePredictor:


    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.data = None


        self.schemes = [
            "Post Office Monthly Income Scheme",
            "Senior Citizen Savings Scheme",
            "Public Provident Fund",
            "Sukanya Samriddhi Yojana",
            "Postal Life Insurance",
            "Rural Postal Life Insurance",
            "National Savings Certificate",
            "Kisan Vikas Patra",
            "Mahila Samman Savings Certificate"
        ]

    def load_data(self, filepath='district_data.csv'):

        try:
            self.data = pd.read_csv(filepath)
            print(f" Loaded data from {filepath}")
            print(f" Dataset contains {len(self.data)} districts across {self.data['state'].nunique()} states")
            return True
        except FileNotFoundError:
            print(f" File not found: {filepath}")
            print("Please run data_generator.py first to generate the dataset")
            return False
        except Exception as e:
            print(f" Error loading data: {str(e)}")
            return False

    def prepare_features(self, df):

        feature_columns = [
            'total_population', 'child_percent', 'youth_percent', 'adult_percent',
            'senior_percent', 'male_percent', 'female_percent', 'literacy_rate',
            'urban_percent', 'rural_percent', 'farmer_percent', 'service_holder_percent',
            'business_percent', 'others_percent', 'avg_income', 'bank_penetration',
            'post_offices_count'
        ]

        # Encode state variable
        if 'state' in df.columns:
            if 'state' not in self.label_encoders:
                self.label_encoders['state'] = LabelEncoder()
                df = df.copy()  
                df['state_encoded'] = self.label_encoders['state'].fit_transform(df['state'])
            else:
                df = df.copy()
                df['state_encoded'] = self.label_encoders['state'].transform(df['state'])
            feature_columns.append('state_encoded')

        return df[feature_columns]

    def train_models(self, df=None):

        if df is None:
            if self.data is None:
                raise ValueError("No data available. Please load data first using load_data()")
            df = self.data

        X = self.prepare_features(df)

        print(" Training models for each POSB scheme...")

        for scheme in self.schemes:
            print(f"  Training model for {scheme}...")

            y = df[scheme]

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)

            # Train Random Forest model
            model = RandomForestRegressor(
                n_estimators=100,
                random_state=42,
                max_depth=10,
                min_samples_split=5
            )
            model.fit(X_train_scaled, y_train)

            # Evaluate
            y_pred = model.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)

            print(f"    MSE: {mse:.2f}, R2: {r2:.3f}")

            # Store model and scaler
            self.models[scheme] = model
            self.scalers[scheme] = scaler

        print(" All models trained successfully!")

    def save_model(self, filepath='posb_predictor_model.joblib'):

        model_data = {
            'models': self.models,
            'scalers': self.scalers,
            'label_encoders': self.label_encoders,
            'schemes': self.schemes
        }
        joblib.dump(model_data, filepath)
        print(f"💾 Model saved to {filepath}")

    def load_model(self, filepath='posb_predictor_model.joblib'):

        try:
            model_data = joblib.load(filepath)
            self.models = model_data['models']
            self.scalers = model_data['scalers']
            self.label_encoders = model_data['label_encoders']
            self.schemes = model_data['schemes']
            print(f"📁 Model loaded from {filepath}")
            return True
        except Exception as e:
            print(f" Error loading model: {str(e)}")
            return False

    def predict_scheme_potential(self, district_data):


        if isinstance(district_data, dict):
            df = pd.DataFrame([district_data])
        else:
            df = district_data.copy()

        X = self.prepare_features(df)

        predictions = {}
        probabilities = {}

        total_population = district_data['total_population'] if isinstance(district_data, dict) else district_data['total_population'].iloc[0]


        max_potential_accounts = self._calculate_max_potential_accounts(district_data)

        for scheme in self.schemes:
            if scheme not in self.models or scheme not in self.scalers:
                print(f"⚠️ Model not found for scheme: {scheme}")
                predictions[scheme] = 0
                probabilities[scheme] = 0.0
                continue

            try:

                X_scaled = self.scalers[scheme].transform(X)


                pred = self.models[scheme].predict(X_scaled)[0]
                predictions[scheme] = max(0, int(pred))

                # Calculate probability
                max_potential = max_potential_accounts[scheme]
                if max_potential > 0:
                    probability = min((predictions[scheme] / max_potential) * 100, 100)
                else:
                    probability = 0

                probabilities[scheme] = round(probability, 2)
            except Exception as e:
                print(f"⚠️ Error predicting for {scheme}: {str(e)}")
                predictions[scheme] = 0
                probabilities[scheme] = 0.0

        return predictions, probabilities

    def _calculate_max_potential_accounts(self, district_data):

        if isinstance(district_data, dict):
            pop = district_data['total_population']
        else:
            pop = district_data['total_population'].iloc[0] if hasattr(district_data['total_population'], 'iloc') else district_data['total_population']
        
        max_potential = {}


        def get_value(key):
            if isinstance(district_data, dict):
                return district_data[key]
            else:
                val = district_data[key]
                return val.iloc[0] if hasattr(val, 'iloc') else val


        senior_pop = int(pop * get_value('senior_percent') / 100)
        service_holders = int(pop * get_value('service_holder_percent') / 100)
        business_people = int(pop * get_value('business_percent') / 100)
        rural_pop = int(pop * get_value('rural_percent') / 100)
        farmers = int(pop * get_value('farmer_percent') / 100)

        max_potential['Post Office Monthly Income Scheme'] = senior_pop + int(pop * get_value('adult_percent') * 0.3 / 100)
        max_potential['Senior Citizen Savings Scheme'] = senior_pop
        max_potential['Public Provident Fund'] = service_holders + business_people
        max_potential['Sukanya Samriddhi Yojana'] = int(pop * get_value('child_percent') * get_value('female_percent') / 10000 * 0.8)
        max_potential['Postal Life Insurance'] = service_holders + business_people + int(pop * get_value('others_percent') * 0.5 / 100)
        max_potential['Rural Postal Life Insurance'] = int(rural_pop * 0.6)
        max_potential['National Savings Certificate'] = service_holders + business_people
        max_potential['Kisan Vikas Patra'] = farmers + int(rural_pop * 0.4)
        max_potential['Mahila Samman Savings Certificate'] = int(pop * get_value('female_percent') * (get_value('youth_percent') + get_value('adult_percent')) / 10000)

        return max_potential

    def get_district_analysis(self, state, district_id=None):

        if self.data is None:
            raise ValueError("No data available. Please load data first using load_data()")

        print(f"Looking for state: '{state}'")
        

        if len(self.data) == 0:
            raise ValueError("Dataset is empty. Please generate data first.")


        state_data = self.data[self.data['state'].str.lower() == state.lower()]

        if len(state_data) == 0:

            partial_matches = self.data[self.data['state'].str.contains(state, case=False, na=False)]
            if len(partial_matches) > 0:
                state_data = partial_matches
                print(f"Using partial match for state: {state}")
            else:
                available_states = list(self.data['state'].unique())
                raise ValueError(f"No data found for state: '{state}'. Available states: {available_states}")

        print(f"Found {len(state_data)} districts for state: {state}")


        if district_id:

            if isinstance(district_id, str):

                district_match = state_data[state_data['district'].str.lower() == district_id.lower()]
                if len(district_match) > 0:
                    district_data = district_match.iloc[0].to_dict()
                    print(f"Found district by name: {district_id}")
                else:

                    partial_district_match = state_data[state_data['district'].str.contains(district_id, case=False, na=False)]
                    if len(partial_district_match) > 0:
                        district_data = partial_district_match.iloc[0].to_dict()
                        print(f"Found district by partial match: {district_id}")
                    else:

                        if len(state_data) > 0:
                            district_data = state_data.iloc[0].to_dict()
                            available_districts = list(state_data['district'].unique())
                            print(f"District '{district_id}' not found. Using first available district. Available districts: {available_districts}")
                        else:
                            raise ValueError(f"No districts found for state: {state}")
            else:

                district_match = state_data[state_data['district_id'] == district_id]
                if len(district_match) > 0:
                    district_data = district_match.iloc[0].to_dict()
                else:
                    if len(state_data) > 0:
                        district_data = state_data.iloc[0].to_dict()
                        print(f"District ID {district_id} not found. Using first available district.")
                    else:
                        raise ValueError(f"No districts found for state: {state}")
        else:

            if len(state_data) > 0:
                district_data = state_data.iloc[0].to_dict()
                print(f"No district specified. Using first district: {district_data['district']}")
            else:
                raise ValueError(f"No districts found for state: {state}")

        predictions, probabilities = self.predict_scheme_potential(district_data)
        max_potential_accounts = self._calculate_max_potential_accounts(district_data)


        scheme_ranking = sorted(predictions.items(), key=lambda x: x[1], reverse=True)

        analysis = {
            'district_info': {
                'state': district_data['state'],
                'district': district_data['district'],
                'district_id': district_data['district_id'],
                'total_population': district_data['total_population'],
                'demographics': {
                    'children': f"{district_data['child_percent']:.1f}%",
                    'youth': f"{district_data['youth_percent']:.1f}%",
                    'adults': f"{district_data['adult_percent']:.1f}%",
                    'seniors': f"{district_data['senior_percent']:.1f}%",
                    'male': f"{district_data['male_percent']:.1f}%",
                    'female': f"{district_data['female_percent']:.1f}%"
                },
                'economic_profile': {
                    'literacy_rate': f"{district_data['literacy_rate']:.1f}%",
                    'urban_population': f"{district_data['urban_percent']:.1f}%",
                    'farmers': f"{district_data['farmer_percent']:.1f}%",
                    'service_holders': f"{district_data['service_holder_percent']:.1f}%",
                    'business_people': f"{district_data['business_percent']:.1f}%",
                    'avg_income': f"₹{district_data['avg_income']:,.0f}",
                    'bank_penetration': f"{district_data['bank_penetration']:.1f}%"
                }
            },
            'scheme_predictions': predictions,
            'scheme_probabilities': probabilities,
            'max_potential_accounts': max_potential_accounts,
            'top_schemes': scheme_ranking[:5],
            'debug_info': {
                'requested_state': state,
                'requested_district': district_id,
                'found_state': district_data['state'],
                'found_district': district_data['district'],
                'available_states': list(self.data['state'].unique()),
                'available_districts_in_state': list(state_data['district'].unique())
            }
        }

        return analysis

    def get_state_summary(self, state):

        if self.data is None:
            raise ValueError("No data available. Please load data first using load_data()")

        state_data = self.data[self.data['state'].str.lower() == state.lower()]
        
        if len(state_data) == 0:
            available_states = list(self.data['state'].unique())
            raise ValueError(f"No data found for state: '{state}'. Available states: {available_states}")


        summary = {
            'state': state,
            'total_districts': len(state_data),
            'total_population': state_data['total_population'].sum(),
            'avg_population_per_district': state_data['total_population'].mean(),
            'demographics': {
                'avg_child_percent': state_data['child_percent'].mean(),
                'avg_youth_percent': state_data['youth_percent'].mean(),
                'avg_adult_percent': state_data['adult_percent'].mean(),
                'avg_senior_percent': state_data['senior_percent'].mean(),
                'avg_male_percent': state_data['male_percent'].mean(),
                'avg_female_percent': state_data['female_percent'].mean(),
            },
            'economic_profile': {
                'avg_literacy_rate': state_data['literacy_rate'].mean(),
                'avg_urban_percent': state_data['urban_percent'].mean(),
                'avg_rural_percent': state_data['rural_percent'].mean(),
                'avg_farmer_percent': state_data['farmer_percent'].mean(),
                'avg_service_holder_percent': state_data['service_holder_percent'].mean(),
                'avg_business_percent': state_data['business_percent'].mean(),
                'avg_income': state_data['avg_income'].mean(),
                'avg_bank_penetration': state_data['bank_penetration'].mean(),
                'total_post_offices': state_data['post_offices_count'].sum()
            },
            'scheme_totals': {},
            'scheme_averages': {},
            'top_performing_districts': {},
            'district_rankings': {}
        }


        for scheme in self.schemes:
            if scheme in state_data.columns:
                summary['scheme_totals'][scheme] = state_data[scheme].sum()
                summary['scheme_averages'][scheme] = state_data[scheme].mean()


        for scheme in self.schemes:
            if scheme in state_data.columns:
                top_district = state_data.nlargest(3, scheme)[['district', scheme]]
                summary['top_performing_districts'][scheme] = top_district.to_dict('records')

        # Overall district rankings by total scheme potential
        state_data_copy = state_data.copy()
        state_data_copy['total_scheme_potential'] = state_data_copy[self.schemes].sum(axis=1)
        top_districts = state_data_copy.nlargest(10, 'total_scheme_potential')[['district', 'total_scheme_potential']]
        summary['district_rankings'] = top_districts.to_dict('records')

        return summary

    def get_scheme_comparison(self, scheme_name):

        if self.data is None:
            raise ValueError("No data available. Please load data first using load_data()")

        if scheme_name not in self.schemes:
            raise ValueError(f"Invalid scheme name. Available schemes: {self.schemes}")


        state_aggregation = self.data.groupby('state').agg({
            scheme_name: ['sum', 'mean', 'count'],
            'total_population': 'sum'
        }).round(2)


        state_aggregation.columns = ['total_accounts', 'avg_accounts_per_district', 'district_count', 'total_population']
        

        state_aggregation['penetration_rate'] = (state_aggregation['total_accounts'] / state_aggregation['total_population'] * 100).round(3)
        

        state_aggregation = state_aggregation.sort_values('total_accounts', ascending=False)


        top_districts = self.data.nlargest(20, scheme_name)[['state', 'district', scheme_name, 'total_population']]
        top_districts['penetration_rate'] = (top_districts[scheme_name] / top_districts['total_population'] * 100).round(3)

        comparison = {
            'scheme_name': scheme_name,
            'national_total': self.data[scheme_name].sum(),
            'national_average': self.data[scheme_name].mean(),
            'state_wise_performance': state_aggregation.to_dict('index'),
            'top_districts_nationwide': top_districts.to_dict('records'),
            'statistics': {
                'min_accounts': self.data[scheme_name].min(),
                'max_accounts': self.data[scheme_name].max(),
                'median_accounts': self.data[scheme_name].median(),
                'std_deviation': self.data[scheme_name].std()
            }
        }

        return comparison

    def get_all_schemes_summary(self):

        if self.data is None:
            raise ValueError("No data available. Please load data first using load_data()")

        schemes_summary = {}
        
        for scheme in self.schemes:
            if scheme in self.data.columns:
                schemes_summary[scheme] = {
                    'total_accounts': self.data[scheme].sum(),
                    'average_per_district': self.data[scheme].mean(),
                    'min_accounts': self.data[scheme].min(),
                    'max_accounts': self.data[scheme].max(),
                    'median_accounts': self.data[scheme].median(),
                    'std_deviation': self.data[scheme].std(),
                    'districts_with_zero': len(self.data[self.data[scheme] == 0])
                }


        scheme_totals = [(scheme, self.data[scheme].sum()) for scheme in self.schemes if scheme in self.data.columns]
        scheme_ranking = sorted(scheme_totals, key=lambda x: x[1], reverse=True)

        summary = {
            'total_districts': len(self.data),
            'total_states': self.data['state'].nunique(),
            'total_population': self.data['total_population'].sum(),
            'schemes_summary': schemes_summary,
            'scheme_ranking': scheme_ranking,
            'top_performing_districts_overall': self._get_top_overall_districts()
        }

        return summary

    def _get_top_overall_districts(self):

        if self.data is None:
            return []


        data_copy = self.data.copy()
        data_copy['total_scheme_accounts'] = data_copy[self.schemes].sum(axis=1)
        data_copy['schemes_per_capita'] = data_copy['total_scheme_accounts'] / data_copy['total_population'] * 1000

        top_districts = data_copy.nlargest(15, 'total_scheme_accounts')[
            ['state', 'district', 'total_population', 'total_scheme_accounts', 'schemes_per_capita']
        ]

        return top_districts.to_dict('records')

    def export_analysis_to_csv(self, analysis_type='district', identifier=None, filename=None):

        if self.data is None:
            raise ValueError("No data available. Please load data first using load_data()")

        if analysis_type == 'district':
            if identifier is None:
                raise ValueError("Please provide state name for district analysis")
            
            analysis = self.get_district_analysis(identifier)
            data_to_export = []
            
            for scheme in self.schemes:
                data_to_export.append({
                    'Scheme': scheme,
                    'Predicted_Accounts': analysis['scheme_predictions'][scheme],
                    'Probability_Percent': analysis['scheme_probabilities'][scheme],
                    'Max_Potential': analysis['max_potential_accounts'][scheme]
                })
            
            df = pd.DataFrame(data_to_export)
            filename = filename or f"{analysis['district_info']['state']}_{analysis['district_info']['district']}_analysis.csv"
            
        elif analysis_type == 'state':
            if identifier is None:
                raise ValueError("Please provide state name for state analysis")
            
            analysis = self.get_state_summary(identifier)
            data_to_export = []
            
            for scheme in self.schemes:
                data_to_export.append({
                    'Scheme': scheme,
                    'Total_Accounts': analysis['scheme_totals'].get(scheme, 0),
                    'Average_Per_District': analysis['scheme_averages'].get(scheme, 0)
                })
            
            df = pd.DataFrame(data_to_export)
            filename = filename or f"{identifier}_state_summary.csv"
            
        elif analysis_type == 'scheme':
            if identifier is None:
                raise ValueError("Please provide scheme name for scheme analysis")
            
            analysis = self.get_scheme_comparison(identifier)
            

            state_data = []
            for state, data in analysis['state_wise_performance'].items():
                state_data.append({
                    'State': state,
                    'Total_Accounts': data['total_accounts'],
                    'Avg_Accounts_Per_District': data['avg_accounts_per_district'],
                    'District_Count': data['district_count'],
                    'Penetration_Rate': data['penetration_rate']
                })
            
            df = pd.DataFrame(state_data)
            filename = filename or f"{identifier.replace(' ', '_')}_scheme_comparison.csv"
            
        else:
            raise ValueError("Invalid analysis_type. Choose 'district', 'state', or 'scheme'")

        df.to_csv(filename, index=False)
        print(f"💾 Analysis exported to {filename}")
        return filename


if __name__ == "__main__":
    print("\n" + "="*80)
    print("🏦 POSB SCHEME PREDICTOR - DEMO")
    print("="*80)
    

    predictor = POSBSchemePredictor()
    

    if predictor.load_data():
        print("\n Training models...")
        predictor.train_models()
        

        predictor.save_model()
        
        print("\n" + "="*80)
        print(" DEMO ANALYSIS")
        print("="*80)
        

        print("\n🏘️  District Analysis Demo:")
        try:
            analysis = predictor.get_district_analysis('Maharashtra')
            print(f"District: {analysis['district_info']['district']}, {analysis['district_info']['state']}")
            print(f"Population: {analysis['district_info']['total_population']:,}")
            print("\nTop 3 Recommended Schemes:")
            for i, (scheme, accounts) in enumerate(analysis['top_schemes'][:3], 1):
                probability = analysis['scheme_probabilities'][scheme]
                print(f"  {i}. {scheme}: {accounts:,} accounts ({probability}% potential)")
        except Exception as e:
            print(f"Error in district analysis: {e}")
        

        print("\n🏛️  State Summary Demo:")
        try:
            state_summary = predictor.get_state_summary('Gujarat')
            print(f"State: {state_summary['state']}")
            print(f"Total Districts: {state_summary['total_districts']}")
            print(f"Total Population: {state_summary['total_population']:,}")
            print(f"Average Literacy Rate: {state_summary['economic_profile']['avg_literacy_rate']:.1f}%")
        except Exception as e:
            print(f"Error in state summary: {e}")
        

        print("\n💰 Scheme Comparison Demo:")
        try:
            scheme_comparison = predictor.get_scheme_comparison('Public Provident Fund')
            print(f"Scheme: {scheme_comparison['scheme_name']}")
            print(f"National Total: {scheme_comparison['national_total']:,} accounts")
            print(f"National Average: {scheme_comparison['national_average']:,.0f} accounts per district")
        except Exception as e:
            print(f"Error in scheme comparison: {e}")
        

        print("\n📁 Export Demo:")
        try:
            filename = predictor.export_analysis_to_csv('district', 'Karnataka', 'sample_district_analysis.csv')
            print(f"Sample analysis exported to: {filename}")
        except Exception as e:
            print(f"Error in export: {e}")
        
        print("\n" + "="*80)
        print(" DEMO COMPLETED SUCCESSFULLY!")
        print("="*80)
        
    else:
        print(" Failed to load data. Please run data_generator.py first.")