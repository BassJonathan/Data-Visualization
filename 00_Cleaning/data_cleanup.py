#IMPORTE
import pandas as pd
import plotly.graph_objects as go
import numpy as np

#Funktion für Ladebalken in der Konsole.
#DISCLAIMER: Ich habe diese Funktion NICHT selbst erstellt! Ich fand nur die Idee cool und habe diese Funktion auf GitHub gefunden. Die Implementation ist eher schlecht und sollte nicht so stark beachtet werden :)
#Daher habe ich den Code auch nicht weiter kommentiert
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 30, fill = '█', printEnd = "\r"):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str)
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
    # Print New Line on Complete
    if iteration == total: 
        print()

#Ab hier ist wieder mein eigener Code :)
#Da der gesamte Prozess etwas lange dauert habe ich mich dazu entschieden, ein paar visuelle Ausgaben über den aktuellen Fortschritt auf der Console zu machen.
#Dadurch kann man sehen, was gerade passiert und die Zeit fühlt sich nicht so lange an
print("Data Merging und Data Cleaning \n ---------------------------------------------") #Ausgabe Titel
print("Dieses Programm kombiniert alle Datasets von Kaggele zu einem großen Dataframe und speichert dieses als lokale CSV-Datei. \n Zudem werden fehlende Werte soweit benötigt durch die passenden Werte ersetzt.") #Ausgabe kurze Beschreibung
print("Der Fortschritt wird dabei durch Ausgaben angezeigt:") #Ausgabe kurze Beschreibung

print("Dataframes werden aus CSV Dateien erstellt...") #Ausgabe Fortschritt

#Dataframes laden
dfFlights = pd.read_csv('../Data/Keggle/flights.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "DESTINATION_AIRPORT": str, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": bool, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": float, "SECURITY_DELAY": float, "AIRLINE_DELAY": float, "LATE_AIRCRAFT_DELAY": float, "WEATHER_DELAY": float}) #Da bei diesem Dataset die low-memory-Warnung kam, habe ich die dtypes beim Import definiert
dfAirports = pd.read_csv('../Data/Keggle/airports.csv')
dfAirlines = pd.read_csv('../Data/Keggle/airlines.csv')

#Column mit Datetime-Format aus den einzelnen Columns erstellen
print("Spalte mit Datetime-Format wird erstellt...") #Ausgabe Fortschritt
dfFlights.insert(loc=3, column='DATE', value=(pd.to_datetime(dfFlights["MONTH"].astype(str) + "." + dfFlights["DAY"].astype(str) + "." + dfFlights["YEAR"].astype(str)))) #Der Monat, der Tag und das Jahr werden als String in eine extra Spalte gespeichert
dfFlights["DATE"] = pd.to_datetime(dfFlights['DATE']) #Aus dem String kann nun ein datetime gecastet werden. Dies ermöglicht bei Darstellungen, auf denen Zeit eine Achse ist, eine schöne Darstellung und kann mit numpy verwendet werden

#Daten aus den Dataframes kombinieren
print("Daten der Airlines und Flughäfen werden eingefügt...") #Ausgabe Fortschritt
l = (len(dfAirports) + len(dfAirlines)) #Diese Variable wird für die Progressbar benötigt und legt die gesamte Anzahl der Schritte fest
printProgressBar(0, l, prefix = 'Progress:', suffix = 'Complete') #Erster Aufruf der Progressbar mit Fortschritt 0

#Arrays für Bedingungen und Werte
conditionsA = [] #Definition eines leeren Arrays für die Bedingungen bei der Airline-Namenszuweisung
valuesA = [] #Definition eines leeren Arrays für die Werte bei der Airline-Namenszuweisung

#Befüllen der einzelnen Arrays für die Airline-Namenszuweisung
for s in range(len(dfAirlines)): #Iteration über das Airline-Dataframe
    conditionsA.append((dfFlights['AIRLINE'] == dfAirlines['IATA_CODE'][s])) #Befüllen des Arrays für die Bedingungen
    valuesA.append(dfAirlines['AIRLINE'][s]) #Befüllen des Arrays für die Werte
    printProgressBar(s+1, l, prefix = 'Progress:', suffix = ('Complete - Einfügen der Airline Namen - Aktuelle Airline: ' + dfAirlines['IATA_CODE'][s])) #Aufruf der Progressbar mit der Übergabe des jeweiligen Iterationdurchgangs

dfFlights.insert(loc=6, column='AIRLINE_NAME', value=(np.select(conditionsA, valuesA))) #Einfügen der Werte in das Dataframe über eine Kombination aus der insert()-Funktion von Pandas und der select()-Funktion von numpy

#Array für Bedingungen und Werte
conditionsOA = []
conditionsDA = []
valuesLo = []
valuesLa = []
valuesNa = []

for i in range(len(dfAirports)):
    conditionsOA.append((dfFlights['ORIGIN_AIRPORT'] == dfAirports['IATA_CODE'][i]))
    conditionsDA.append((dfFlights['DESTINATION_AIRPORT'] == dfAirports['IATA_CODE'][i]))
    valuesLa.append(dfAirports['LATITUDE'][i])
    valuesLo.append(dfAirports['LONGITUDE'][i])
    valuesNa.append(dfAirports['AIRPORT'][i])
    printProgressBar(i+s+2, l, prefix = 'Progress:', suffix = ('Complete - Einfügen der Flughafen Koordinaten - Aktueller Flughafen: ' + dfAirports['IATA_CODE'][i]))

dfFlights.insert(loc=10, column='ORIGIN_AIRPORT_NAME', value=(np.select(conditionsOA, valuesNa)))
dfFlights.insert(loc=11, column='ORIGIN_AIRPORT_LATITUDE', value=(np.select(conditionsOA, valuesLa)))
dfFlights.insert(loc=12, column='ORIGIN_AIRPORT_LONGITUDE', value=(np.select(conditionsOA, valuesLo)))
dfFlights.insert(loc=14, column='DESTINATION_AIRPORT_NAME', value=(np.select(conditionsDA, valuesNa)))
dfFlights.insert(loc=15, column='DESTINATION_AIRPORT_LATITUDE', value=(np.select(conditionsDA, valuesLa)))
dfFlights.insert(loc=16, column='DESTINATION_AIRPORT_LONGITUDE', value=(np.select(conditionsDA, valuesLo)))

print("Cleaning wird ausgeführt...")

dfFlights['AIR_SYSTEM_DELAY'].fillna(0, inplace=True)
dfFlights['SECURITY_DELAY'].fillna(0, inplace=True)
dfFlights['AIRLINE_DELAY'].fillna(0, inplace=True)
dfFlights['LATE_AIRCRAFT_DELAY'].fillna(0, inplace=True)
dfFlights['WEATHER_DELAY'].fillna(0, inplace=True)

print("Datei wird gespeichert... Dies kann ein paar Minuten dauern, da die Datei größer als 1GB ist!")

dfFlights.to_csv(r'../Data/flights_cleaned.csv')

print("Verarbeitung und Speichern abgeschlossen!")
