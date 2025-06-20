# Updated FastAPI backend for chart rendering based on user-selected x, y, and label fields
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import plotly.express as px
import json
import numpy as np
from io import StringIO


app = FastAPI()

# Enable CORS for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# LOAD "D:\Semester 4\Data Visualization\DataVisualizer\backend\data\example\OECD.ENV.EPI,DSD_PAT_DEV@DF_PAT_DEV,1.0+all.csv"
DF = pd.read_csv(r"D:\Semester 4\Data Visualization\DataVisualizer\backend\data\example\OECD.ENV.EPI,DSD_PAT_DEV@DF_PAT_DEV,1.0+all.csv", encoding='utf-8', low_memory=False)
# select columns['TIME_PERIOD', 'REF_AREA', 'TECH']
DF = DF[['TIME_PERIOD', 'REF_AREA', 'TECH']]
# rename TIME_PERIOD to Year
DF.rename(columns={'TIME_PERIOD': 'Year'}, inplace=True)
# rename 'Reference area' to 'Country'
DF.rename(columns={'REF_AREA': 'Country'}, inplace=True)
# rename 'TECH' to 'Technology domain'
DF.rename(columns={'TECH': 'Technology domain'}, inplace=True)
# Remove rows with any null values
DF = DF.dropna()

#check if the DataFrame is loaded correctly
if DF.empty:
    raise ValueError("DataFrame is empty. Please check the file path and content.")

@app.get("/api/getUniqueValuesForYear")
async def get_unique_values_for_year():
    #sort the unique years in ascending order
    unique_years = sorted(DF['Year'].unique().tolist())
    print("DataFrame columns:", DF.columns.tolist())
    return JSONResponse(content={"unique_years": unique_years})
    

@app.get("/api/getUniqueValuesForCountry")
async def get_unique_values_for_country():
    # sort the unique countries in alphabetical order
    unique_countries = sorted(DF['Country'].unique().tolist())
    print("DataFrame columns:", DF.columns.tolist())
    return JSONResponse(content={"unique_countries": unique_countries})

@app.get("/api/getUniqueValuesForTechnologyDomain")
async def get_unique_values_for_technology_domain():
    # sort the unique technology domains in alphabetical order
    unique_tech_domains = sorted(DF['Technology domain'].unique().tolist())
    print("DataFrame columns:", DF.columns.tolist())
    return JSONResponse(content={"unique_tech_domains": unique_tech_domains})

@app.post("/api/getTotalPatentsFromSelectedYearsCountriesAndTechnologyDomains")
async def get_total_patents_from_selected_years_countries_and_technology_domains(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])

    # Filter the DataFrame for the selected years, countries and technology domains
    df = DF[DF['Year'].isin(selected_years) & DF['Country'].isin(selected_countries) & DF['Technology domain'].isin(selected_tech_domains)]
    # Count the number of patents
    total_patents = df.shape[0]
    return JSONResponse(content={"total_patents": total_patents})

@app.post("/api/getBarChartForNumberOfPatentsWithRespectToCountry")
async def get_bar_chart_for_number_of_patents_with_respect_to_country(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    groupby_var = 'Country'
    columns_to_count = ['Technology domain']  # Specify the columns to count
    # Filter the DataFrame for the selected years and countries and technology domains
    df = DF[DF['Year'].isin(selected_years) & DF['Country'].isin(selected_countries) & DF['Technology domain'].isin(selected_tech_domains)]
    # Group the DataFrame by the specified variable and count the number of patents
    df_for_bar_chart = df.groupby(groupby_var)[*columns_to_count].count().reset_index()
    #rename the columns
    df_for_bar_chart.rename(columns={'Technology domain': 'number of patents'}, inplace=True)
    # sort the DataFrame by the number of patents in descending order
    df_for_bar_chart.sort_values(by='number of patents', ascending=False, inplace=True)
    #bar chart
    fig = px.bar(df_for_bar_chart, x='Country', y='number of patents', title='Total number of patents from the selected years and technology domains<br>with respect to country', labels={'Country': 'Country', 'number of patents': 'Number of Patents'},width= 700)
    return JSONResponse(content=json.loads(fig.to_json()))
    
@app.post("/api/getBarChartForNumberOfPatentsWithRespectToTechnologyDomain")
async def get_bar_chart_for_number_of_patents_with_respect_to_technology_domain(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    groupby_var = 'Technology domain'
    # Filter the DataFrame for the selected years and technology domains and countries
    df = DF[DF['Year'].isin(selected_years) & DF['Technology domain'].isin(selected_tech_domains) & DF['Country'].isin(selected_countries)]
    # transform the DataFrame to feed the bar chart
    columns_to_count = ['Country']  # Specify the columns to count
    df_for_bar_chart = df.groupby(groupby_var)[*columns_to_count].count().reset_index()
    # Rename the columns
    df_for_bar_chart.rename(columns={'Country': 'number of patents'}, inplace=True)
    # Sort the DataFrame by the number of patents in descending order
    df_for_bar_chart.sort_values(by='number of patents', ascending=False, inplace=True)
    #bar chart
    fig = px.bar(df_for_bar_chart, x='Technology domain', y='number of patents', title='Total number of patents from the selected years and countries<br>with respect to technology domain', labels={'Technology domain': 'Technology Domain', 'number of patents': 'Number of Patents'},width= 700)
    return JSONResponse(content=json.loads(fig.to_json()))

@app.post("/api/getGroupBarChartForNumberOfPatentsPerCountryWithRespectToYear")
async def get_group_bar_chart_for_number_of_patents_per_country_with_respect_to_year(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    #apply row filter to keep only selected years and countries and technology domains
    df = DF[DF['Year'].isin(selected_years) & DF['Country'].isin(selected_countries) & DF['Technology domain'].isin(selected_tech_domains)]
    #pivot the DataFrame to get the number of patents per country with respect to year
    df_for_group_bar_chart = df.pivot_table(index='Country', columns='Year', values='Technology domain', aggfunc='count').reset_index()
    fig = px.bar(df_for_group_bar_chart, x='Country', y=df_for_group_bar_chart.columns[1:], title='Number of patents from selected countries per year<br>with respect to country', labels={'Country': 'Country', 'value': 'Number of Patents'},barmode='group',width= 700)
    return JSONResponse(content=json.loads(fig.to_json()))

@app.post("/api/getGroupBarChartForNumberOfPatentsPerTechnologyDomainWithRespectToYear")
async def get_group_bar_chart_for_number_of_patents_per_technology_domain_with_respect_to_year(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    #apply row filter to keep only selected years and technology domains and countries
    df = DF[DF['Year'].isin(selected_years) & DF['Technology domain'].isin(selected_tech_domains) & DF['Country'].isin(selected_countries)]
    #pivot the DataFrame to get the number of patents per technology domain with respect to year
    df_for_group_bar_chart = df.pivot_table(index='Technology domain', columns='Year', values='Country', aggfunc='count').reset_index()
    fig = px.bar(df_for_group_bar_chart, x='Technology domain', y=df_for_group_bar_chart.columns[1:], title='Number of patents from selected countries per year<br>with respect to technology domain', labels={'Technology domain': 'Technology Domain', 'value': 'Number of Patents'}, barmode='group',width= 700)
    return JSONResponse(content=json.loads(fig.to_json()))

@app.post("/api/getLineGraphForNumberOfPatentsWithRespectToYear")
async def get_line_graph_for_number_of_patents_with_respect_to_year(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    groupby_var = 'Year'
    columns_to_count = ['Technology domain']
    # Filter the DataFrame for the selected years and countries and technology domains
    df = DF[DF['Year'].isin(selected_years) & DF['Country'].isin(selected_countries) & DF['Technology domain'].isin(selected_tech_domains)]
    # Group the DataFrame by the specified variable and count the number of patents
    df_for_line_graph = df.groupby(groupby_var)[*columns_to_count].count().reset_index()
    # Rename the columns
    df_for_line_graph.rename(columns={'Technology domain': 'number of patents'}, inplace=True)
    # Create the line graph
    fig = px.line(df_for_line_graph, x='Year', y='number of patents', title='Total number of patents from selected countries and technology domains<br>with respect to year', labels={'Year': 'Year', 'number of patents': 'Number of Patents'}, markers=True, line_shape='spline',width= 700)
    # highlight the points 
    fig.update_traces(mode='lines+markers', marker=dict(size=5), line=dict(width=2))
    return JSONResponse(content=json.loads(fig.to_json()))

@app.post("/api/getMultipleLineGraphForNumberOfPatentsPerTechnologyDomainWithRespectToYear")
async def get_multiple_line_graph_for_number_of_patents_per_technology_domain_with_respect_to_year(request: Request):
    body = await request.json()
    selected_years = body.get("selected_years", [2016, 2017, 2018, 2019, 2020])
    selected_countries = body.get("selected_countries", [])
    selected_tech_domains = body.get("selected_tech_domains", [])
    # Filter the DataFrame for the selected years and technology domains and countries
    df = DF[DF['Year'].isin(selected_years) & DF['Technology domain'].isin(selected_tech_domains) & DF['Country'].isin(selected_countries)]
    # pivot the DataFrame to get the number of patents per technology domain with respect to year
    df_for_line_graph = df.pivot_table(index='Year', columns='Technology domain', values='Country', aggfunc='count').reset_index()
    fig = px.line(df_for_line_graph, x='Year', y=df_for_line_graph.columns[1:], title='Number of patents from selected countries per technology domain<br>with respect to year', labels={'Year': 'Year', 'value': 'Number of Patents'}, markers=True, line_shape='spline',width= 700)
    # highlight the points
    fig.update_traces(mode='lines+markers', marker=dict(size=5), line=dict(width=2))
    return JSONResponse(content=json.loads(fig.to_json()))
