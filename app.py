import streamlit as st
import util  # Import your utility functions
import pandas as pd
import plotly.express as px
# Load the saved artifacts (model and columns)
util.load_saved_artifacts()

def main():
    st.title("Bangalore Home Price Prediction")

    # Area input
    sqft = st.number_input("Area (Square Feet)", min_value=0, value=1000)

    # BHK selection
    bhk = st.selectbox("BHK", [1, 2, 3, 4, 5])

    # Bathroom selection
    bath = st.selectbox("Bathrooms", [1, 2, 3, 4, 5])

    # Location selection
    locations = util.get_location_names()
    location = st.selectbox("Location", locations)
    df=pd.read_csv(r"C:\Users\gopal\Downloads\Bangalore-House-Price-Prediction-main\Bangalore-House-Price-Prediction-main\model\bhp.csv")
    # Button to estimate price
    if st.button("Estimate Price"):
        estimated_price = util.get_estimated_price(location, sqft, bhk, bath)
        st.success(f"Estimated Price: {estimated_price} Lakh")
        
        df = df[df['location'] == location]
        df = df.reset_index()
        df=df.drop(columns=['index'])
        # Display the title
        st.markdown("<p style='color: green; font-size: 20px;'><strong>Training Data taken for {}</strong></p>".format(location), unsafe_allow_html=True)

        # Create two columns for the table and the scatter plot
        col1, col2 = st.columns([4, 2.5])

        # Display the DataFrame in the first column
        with col1:
            st.dataframe(df)

        # Create a scatter plot in the second column
        with col2:
            fig = px.scatter(df, x='total_sqft', y='price', color='size', title=location)
            st.plotly_chart(fig)
if __name__ == "__main__":
    main()
