#IMPORTE
from re import T
import pandas as pd
import numpy as np
#Plotly Express importieren
import plotly.express as px

#Verbesserungsvorschläge von Pandas auf der Console ausblenden, da diese für diese Zwecke nicht funktionieren
pd.options.mode.chained_assignment = None

#Dataframe einlesen
df = pd.read_csv('../Data/flights_cleaned.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "AIRLINE_NAME": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "ORIGIN_AIRPORT_NAME": str, "ORIGIN_AIRPORT_LATITUDE": float, "ORIGIN_AIRPORT_LONGITUDE": float, "DESTINATION_AIRPORT": str, "DESTINATION_AIRPORT_NAME": str, "DESTINATION_AIRPORT_LATITUDE": float, "DESTINATION_AIRPORT_LONGITUDE": float, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": int, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": int, "SECURITY_DELAY": int, "AIRLINE_DELAY": int, "LATE_AIRCRAFT_DELAY": int, "WEATHER_DELAY": int})

#Neues Dataframe, in dem nur die benötigten Columns enthalten sind. Dadurch ist die Verarbeitung schneller
df_c = df[["AIRLINE_NAME", "ARRIVAL_DELAY", "AIR_SYSTEM_DELAY", "SECURITY_DELAY", "AIRLINE_DELAY", "LATE_AIRCRAFT_DELAY", "WEATHER_DELAY"]]

#Array mit allen Bedingungen
conditions = [
    ((df_c['AIR_SYSTEM_DELAY'] == 0) & (df_c['SECURITY_DELAY'] == 0) & (df_c['AIRLINE_DELAY'] == 0) & (df_c['LATE_AIRCRAFT_DELAY'] == 0) & (df_c['WEATHER_DELAY'] == 0) & (df_c['ARRIVAL_DELAY'] <= 0)),
    ((df_c['AIR_SYSTEM_DELAY'] == 0) & (df_c['SECURITY_DELAY'] == 0) & (df_c['AIRLINE_DELAY'] == 0) & (df_c['LATE_AIRCRAFT_DELAY'] == 0) & (df_c['WEATHER_DELAY'] == 0) & (df_c['ARRIVAL_DELAY'] > 0)),
    ((df_c['AIR_SYSTEM_DELAY'] >= df_c['SECURITY_DELAY']) & (df_c['AIR_SYSTEM_DELAY'] >= df_c['AIRLINE_DELAY']) & (df_c['AIR_SYSTEM_DELAY'] >= df_c['LATE_AIRCRAFT_DELAY']) & (df_c['AIR_SYSTEM_DELAY'] >= df_c['WEATHER_DELAY'])),
    ((df_c['SECURITY_DELAY'] >= df_c['AIR_SYSTEM_DELAY']) & (df_c['SECURITY_DELAY'] >= df_c['AIRLINE_DELAY']) & (df_c['SECURITY_DELAY'] >= df_c['LATE_AIRCRAFT_DELAY']) & (df_c['SECURITY_DELAY'] >= df_c['WEATHER_DELAY'])),
    ((df_c['AIRLINE_DELAY'] >= df_c['SECURITY_DELAY']) & (df_c['AIRLINE_DELAY'] >= df_c['AIR_SYSTEM_DELAY']) & (df_c['AIRLINE_DELAY'] >= df_c['LATE_AIRCRAFT_DELAY']) & (df_c['AIRLINE_DELAY'] >= df_c['WEATHER_DELAY'])),
    ((df_c['LATE_AIRCRAFT_DELAY'] >= df_c['SECURITY_DELAY']) & (df_c['LATE_AIRCRAFT_DELAY'] >= df_c['AIRLINE_DELAY']) & (df_c['LATE_AIRCRAFT_DELAY'] >= df_c['AIR_SYSTEM_DELAY']) & (df_c['LATE_AIRCRAFT_DELAY'] >= df_c['WEATHER_DELAY'])),
    ((df_c['WEATHER_DELAY'] >= df_c['SECURITY_DELAY']) & (df_c['WEATHER_DELAY'] >= df_c['AIRLINE_DELAY']) & (df_c['WEATHER_DELAY'] >= df_c['AIR_SYSTEM_DELAY']) & (df_c['WEATHER_DELAY'] >= df_c['LATE_AIRCRAFT_DELAY']))
]

#Array mit allen Werte wenn eine Bedingung zutrifft
values = ['No Delay', 'Delay w/o Reason', 'Air System Delay', 'Security Delay', 'Airline Delay', 'Late Aircraft Delay', 'Weather Delay']

#Neue Spalte in df auf Basis der Bedingungen und Werte
df_c['REASON'] = np.select(conditions, values)
#Übergeordnete Gruppierung hinzufügen
df_c['AIRLINES'] = "Airlines"

#Treemap über plotly.express erstellen. Der Path gibt die Verschachtelungsreihenfolge an. Die Aggregation der Werte wird automatisch gemacht.
fig = px.treemap(df_c, path=['AIRLINES', 'AIRLINE_NAME', 'REASON'], title="Alle Flüge nach Airlines mit möglichen Verspätungen", color_discrete_sequence=px.colors.qualitative.Plotly)

#Fig anzeigen
fig.show()

#Als HTML speichern und Fig anzeigen
#fig.write_html("treemap2.html", auto_open=True)