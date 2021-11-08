#IMPORTE
import pandas as pd
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots

#Dataframe aus CSV-Datei
df = pd.read_csv('../Data/flights_cleaned.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "AIRLINE_NAME": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "ORIGIN_AIRPORT_NAME": str, "ORIGIN_AIRPORT_LATITUDE": float, "ORIGIN_AIRPORT_LONGITUDE": float, "DESTINATION_AIRPORT": str, "DESTINATION_AIRPORT_NAME": str, "DESTINATION_AIRPORT_LATITUDE": float, "DESTINATION_AIRPORT_LONGITUDE": float, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": int, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": float, "SECURITY_DELAY": float, "AIRLINE_DELAY": float, "LATE_AIRCRAFT_DELAY": float, "WEATHER_DELAY": float})
#df = pd.read_csv('Data/Pre-Cleaned/flights_all_cleaned.csv')

#Dataframes für die Verarbeitung erstellen
airports = df[['ORIGIN_AIRPORT', 'FLIGHT_NUMBER']].copy() #df für die Liste der Airports
nodes = df[['DESTINATION_AIRPORT', 'ORIGIN_AIRPORT', 'FLIGHT_NUMBER']].copy() #df für die einzelnen Nodes des Chord Diagramms

#Verarbeitung des airports df
airports = airports.groupby('ORIGIN_AIRPORT').agg({'FLIGHT_NUMBER': 'count'}).reset_index() #Gruppieren nach den Airports und zählen der einzelnen Flüge
airports = airports[airports['ORIGIN_AIRPORT'].str.len() < 4] #Letztes Cleaning, sollten noch falsche Werte vorhanden sein
airports = airports.sort_values(by=['FLIGHT_NUMBER'], ascending = False) #Dataframe sortieren nach der Anzahl der Flüge. Um die höchstfrequentierten oben zu haben, muss ascending (warum auch immer?) auf False gesetzt werden
airports = airports.head(25) #Nur die Top 25 Flughäfen behalten
totalFlights = airports['FLIGHT_NUMBER'].sum() #Summe aller Flüge für die Prozentrechnung
totalFlights = 100 / totalFlights #Wert auf ein Prozent herunterrechnen
airports = airports['ORIGIN_AIRPORT'] #Spalte mit Anzahl der Flüge wegfallen lassen
airports = airports.reset_index(drop = True) #Index resetten und Alten droppen
airportslist = airports.values.tolist() #Liste aus df erstellen
print("---------------------------------- \n Liste der Airports:")
print(airportslist) #Ausgabe der Liste
print("---------------------------------- \n Matrix:")

master = [] #Master Array. Durch die Verschachtelung kann die Ausgabe direkt in das js-File übertragen werden

#Erstellen der Matrix
for i in range(len(airportslist)): #Iteration über die Airportliste
    exec('flights%s = nodes.loc[df["ORIGIN_AIRPORT"] == airportslist[%s]]' %(i, i)) #Erstellen eines eigenen DFs für jeden Flughafen
    exec('airport%s = []' %(i)) #Erstellen eines Arrays für jeden Flughafen
    for t in range(len(airportslist)): #Iteration über die Airportliste
        try: #Try, da es einen KeyError gibt, sollte ein Airport in dem DF nicht vorkommen
            exec('airport%s.append((flights%s["DESTINATION_AIRPORT"].value_counts()[airportslist[%s]])*totalFlights)' %(i, i, t)) #Für jeden Airport die Anzahl in dem Dataframe prüfen und Wert an das Array appenden
        except KeyError: #KeyError catchen
            exec('airport%s.append(0.0)' %(i)) #Wenn KeyError einfach 0.0 appenden
    #exec('print(airport%s)' %(i)) #Ausgabe des Arrays
    exec('master.append(airport%s)' %(i)) #Einzelne Arrays an das master-Array appenden
    print(" " + str(i) + "/" + str(len(airports)), end="\r") #Fortschritt in Konsole anzeigen

print(master) #Master-Array ausgeben
#Die Werte können dann aus der Konsole kopiert und in das .js eingefügt werden.
#Ich habe leider keinen schnelleren/besseren Weg gefunden diesen Datentransfer zu machen