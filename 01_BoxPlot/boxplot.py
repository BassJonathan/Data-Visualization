#IMPORTE
import pandas as pd
import plotly.graph_objects as go
import numpy as np

#Array für Farben der einzelnen Boxplots
colors = ['#e6194B', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#9A6324', '#800000', '#808000', '#000075']

#Dataframe aus CSV erstellen und Datentypen für schnelleres Einlesen angeben
df = pd.read_csv('../Data/flights_cleaned.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "AIRLINE_NAME": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "ORIGIN_AIRPORT_NAME": str, "ORIGIN_AIRPORT_LATITUDE": float, "ORIGIN_AIRPORT_LONGITUDE": float, "DESTINATION_AIRPORT": str, "DESTINATION_AIRPORT_NAME": str, "DESTINATION_AIRPORT_LATITUDE": float, "DESTINATION_AIRPORT_LONGITUDE": float, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": int, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": float, "SECURITY_DELAY": float, "AIRLINE_DELAY": float, "LATE_AIRCRAFT_DELAY": float, "WEATHER_DELAY": float})

#Dataframe auf notwendige Spalten reduzieren
df = df[['DATE', 'AIRLINE', 'AIRLINE_NAME', 'DEPARTURE_DELAY']].copy()

#Liste/Array mit allen Airlines machen. In dieser Liste sind nur die abgekürzten Namen vorhanden
airlines = df['AIRLINE'].drop_duplicates().tolist()

#Liste/Array mit ausgeschriebenen Airlinenamen für Legende
airlineNames = df['AIRLINE_NAME'].drop_duplicates().tolist()

#Dataframe nach dem Datum gruppieren und den median der Abflugsverspätung generieren
df = df.groupby(['DATE', 'AIRLINE']).median().reset_index()

#go-Figure erstellen
fig = go.Figure()

#Iteration über die Liste mit den Airlines
for i in range(len(airlines)):
    exec('df%s = df.loc[df["AIRLINE"] == airlines[%s]]' %(i, i)) #Für jede Airline wird ein eigenes Dataframe erstellt, in dem nur die Flüge dieser Airline vorhanden sind
    exec('fig.add_trace(go.Box(x = df%s["AIRLINE"], y = df%s["DEPARTURE_DELAY"].values, name = airlineNames[%s], marker_color = colors[%s], boxpoints = "all"))' %(i, i, i, i)) #Aus jedem Dataframe wird ein eigener Boxplot erstellt und als trace an die fig hinzugefügt

#Layout updaten
fig.update_layout(
    title=dict( #Dict für Titel
        text='Abflugsverspätung nach Airlines', #Text
        x=0.45 #x-Verschiebung
    ),
    yaxis=dict( #Dict für y-Achse
        autorange=True, #Autorange an
        showgrid=True, #Grid an für bessere Lesbarkeit
        zeroline=True, #Nulllinie an für bessere Lesbarkeit
        dtick=5, #Ticks alle fünf Einheiten
        gridcolor='rgb(255, 255, 255)', #Farbe für Grid
        gridwidth=1, #Dicke der Gridlinien
        zerolinecolor='rgb(150, 150, 255)', #Farbe für Nulllinie
        zerolinewidth=2, #Dicke der Nulllinie
        title_text="Durschnittliche Verspätung in Minuten pro Tag" #Beschriftug der y-Achse
    ),
    xaxis=dict( #Dict für x-Achse
        title_text = "Airlines" #Beschriftung für x-Achse
    )
)

#Figure anzeigen
fig.show()

#Als HTML speichern und Figure anzeigen
#fig.write_html("boxplot2.html", auto_open=True)