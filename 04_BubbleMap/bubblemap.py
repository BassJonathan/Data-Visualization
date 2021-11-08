#IMPORTE
import pandas as pd
import plotly.graph_objects as go
import plotly

#Mapbox Access Token in Variable speichern
mapbox_access_token = 'pk.eyJ1IjoiZ2FtZXNsb290IiwiYSI6ImNrbW0zd2szdDFoN3Uydm56aThjMnhuazcifQ.NuKdMubAMaLf2d-KwQ0E9A'

#Dataframe einlesen
df = pd.read_csv('../Data/flights_cleaned.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "AIRLINE_NAME": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "ORIGIN_AIRPORT_NAME": str, "ORIGIN_AIRPORT_LATITUDE": float, "ORIGIN_AIRPORT_LONGITUDE": float, "DESTINATION_AIRPORT": str, "DESTINATION_AIRPORT_NAME": str, "DESTINATION_AIRPORT_LATITUDE": float, "DESTINATION_AIRPORT_LONGITUDE": float, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": int, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": float, "SECURITY_DELAY": float, "AIRLINE_DELAY": float, "LATE_AIRCRAFT_DELAY": float, "WEATHER_DELAY": float})

#Da in der CSV für die Airports nicht immer die Koordinaten für alle Flughäfen enthalten sind, muss hier erst ein cleaning gemacht werden
#dfFlights = dfFlights.drop(dfFlights[(dfFlights['ORIGIN_AIRPORT_LATITUDE'] == 0 | dfFlights['ORIGIN_AIRPORT_LONGITUDE'] == 0 | dfFlights['DESTINATION_AIRPORT_LATITUDE'] == 0 | dfFlights['DESTINATION_AIRPORT_LONGITUDE'] == 0)].index)
#dfFlights = dfFlights[dfFlights['ORIGIN_AIRPORT_LATITUDE'] != 0]
#dfFlights = dfFlights[dfFlights['DESTINATION_AIRPORT_LATITUDE'] != 0]
#dfFlights.dropna(subset=['ORIGIN_AIRPORT_LATITUDE', 'ORIGIN_AIRPORT_LONGITUDE', 'DESTINATION_AIRPORT_LATITUDE', 'DESTINATION_AIRPORT_LONGITUDE'])
df = df.loc[df['ORIGIN_AIRPORT_LATITUDE'] * df['ORIGIN_AIRPORT_LONGITUDE'] * df['DESTINATION_AIRPORT_LATITUDE'] * df['DESTINATION_AIRPORT_LONGITUDE'] != 0]

#Dataframe für die Startflughäfen mit Gruppierung auf die Flughäfen und Aggregation der anderen benötigten Werte z.T. durch verschiedene Aggregationsfunktionen. Diese werden mit Hilfe eines Multiindex gespeichert.
dfOA = df.groupby('ORIGIN_AIRPORT').agg({'ORIGIN_AIRPORT_LATITUDE': 'max', 'ORIGIN_AIRPORT_LONGITUDE': 'max', 'DEPARTURE_DELAY': ['count', 'mean', 'median'], 'ORIGIN_AIRPORT_NAME': 'max'}).reset_index()
#Neue Spalte in Dataframe für Textausgabe bei hover
dfOA['text'] = 'Am ' + dfOA['ORIGIN_AIRPORT_NAME', 'max'].astype(str) + ' starteten 2015 insgesamt ' + dfOA['DEPARTURE_DELAY', 'count'].astype(str) + ' Flüge, <br> welche durchschnittlich ' + dfOA['DEPARTURE_DELAY', 'mean'].round(2).astype(str) + ' Minuten von der geplanten Startzeit abwichen.'

#Dataframe für die Zielflughäfen mit Gruppierung auf die Flughäfen und Aggregation der anderen benötigten Werte z.T. durch verschiedene Aggregationsfunktionen. Diese werden mit Hilfe eines Multiindex gespeichert.
dfDA = df.groupby('DESTINATION_AIRPORT').agg({'DESTINATION_AIRPORT_LATITUDE': 'max', 'DESTINATION_AIRPORT_LONGITUDE': 'max', 'ARRIVAL_DELAY': ['count', 'mean', 'median'], 'DESTINATION_AIRPORT_NAME': 'max'}).reset_index()
#Neue Spalte in Dataframe für Textausgabe bei hover
dfDA['text'] = 'Am ' + dfDA['DESTINATION_AIRPORT_NAME', 'max'].astype(str) + ' landeten 2015 insgesamt ' + dfDA['ARRIVAL_DELAY', 'count'].astype(str) + ' Flüge, <br> welche durchschnittlich ' + dfDA['ARRIVAL_DELAY', 'mean'].round(2).astype(str) + ' Minuten von der geplanten Landezeit abwichen.'

#Erstellen des Figure-Objektes
fig = go.Figure()

#Scatter MapBox für die Startflughäfen
fig.add_trace(go.Scattermapbox(
    lat=dfOA['ORIGIN_AIRPORT_LATITUDE', 'max'], #Längengrade der Startflughäfen. Da bei der .agg-Funktion zwingend eine Aggregationsfunktion erforderlich ist, wurde hier einfach max genommen. Es hätte aber auch eine andere wie mean genommen werden können, solange die Werte nicht verfälscht werden.
    lon=dfOA['ORIGIN_AIRPORT_LONGITUDE', 'max'], #Breitengrade der Startflughäfen. Da bei der .agg-Funktion zwingend eine Aggregationsfunktion erforderlich ist, wurde hier einfach max genommen. Es hätte aber auch eine andere wie mean genommen werden können, solange die Werte nicht verfälscht werden.
    mode = "markers", #Definition des Modes --> Hier Marker
    marker = { #Liste mit den Attributen für die einzelnen Marker
       "size": (10 + (dfOA['DEPARTURE_DELAY', 'count'] / 10000)), #Die Größe der einzelnen Marker richtet sich nach der Anzahl der Flüge. Damit die kleinen Flugäfen noch sichtbar sind ist ein offset von 10 nötig
       "reversescale": False, #Die Skala wird hier nicht invertiert
       "colorscale": 'Turbo', #Der Skala wird die vordfinierte Farbskala Turbo zugewiesen. Ich habe mich für diese entschieden, da sie einen guten Kontrast hat und auch schon kleine Variationen sichtbar sind
       "colorbar": dict(title=(chr(216) + " der Abweichung der tatsächlichen Startzeit zu der Geplanten in Minuten"), titleside="right", dtick = 5), #Beschriftung der Skala auf der rechten Seite. Um das Durchschnitts-Zeichen einzufügen habe ich den ASCII-Code verwendet
       "cmin" : -(dfOA['DEPARTURE_DELAY', 'mean'].max()), #Da bei der Farbskala die neutrale Farbe (Grün) in der Mitte sein muss, müssen die min- und max-Werte gleich sein. Deshalb wird hier der Maximalwert im Minus verwendet
       "color" : dfOA['DEPARTURE_DELAY', 'mean'], #Die Farbe richtet sich nach der durchschnittlichen Verspätung aller Flüge an diesem Flughafen
       "cmax" : dfOA['DEPARTURE_DELAY', 'mean'].max() #Max-Wert der Skala
    },
    text= dfOA['text'], #Text für Hover wird zugewiesem
    #hovertext = dfOA['text'],
    #hoverinfo = "text",
    name = "Departure Delays" #Name für die Trace
))

#Scatter MapBox für die Zielflughäfen
fig.add_trace(go.Scattermapbox(
    lat=dfDA['DESTINATION_AIRPORT_LATITUDE', 'max'], #Längengrade der Zielflughäfen. Da bei der .agg-Funktion zwingend eine Aggregationsfunktion erforderlich ist, wurde hier einfach max genommen. Es hätte aber auch eine andere wie mean genommen werden können, solange die Werte nicht verfälscht werden.
    lon=dfDA['DESTINATION_AIRPORT_LONGITUDE', 'max'], #Breitengrade der Zielflughäfen. Da bei der .agg-Funktion zwingend eine Aggregationsfunktion erforderlich ist, wurde hier einfach max genommen. Es hätte aber auch eine andere wie mean genommen werden können, solange die Werte nicht verfälscht werden.
    visible = False, #Damit beim ersten Öffnen der Figure nicht beide Traces überlagert angezeigt werden, wird diese initial unischtbar gemacht
    mode = "markers", #Definition des Modes --> Hier Marker
    marker = { #Liste mit den Attributen für die einzelnen Marker
       "size": (10 + (dfDA['ARRIVAL_DELAY', 'count'] / 10000)), #Die Größe der einzelnen Marker richtet sich nach der Anzahl der Flüge. Damit die kleinen Flugäfen noch sichtbar sind ist ein offset von 10 nötig
       "reversescale": False, #Die Skala wird hier nicht invertiert
       "colorscale": 'Turbo', #Der Skala wird die vordfinierte Farbskala Turbo zugewiesen. Ich habe mich für diese entschieden, da sie einen guten Kontrast hat und auch schon kleine Variationen sichtbar sind
       "colorbar": dict(title=(chr(216) + " der Abweichung der tatsächlichen Landezeit zu der Geplanten in Minuten"), titleside="right", dtick = 5), #Beschriftung der Skala auf der rechten Seite. Um das Durchschnitts-Zeichen einzufügen habe ich den ASCII-Code verwendet
       "cmin" : -(dfDA['ARRIVAL_DELAY', 'mean'].max()), #Da bei der Farbskala die neutrale Farbe (Grün) in der Mitte sein muss, müssen die min- und max-Werte gleich sein. Deshalb wird hier der Maximalwert im Minus verwendet
       "color" : dfDA['ARRIVAL_DELAY', 'mean'], #Die Farbe richtet sich nach der durchschnittlichen Verspätung aller Flüge an diesem Flughafen
       "cmax" : dfDA['ARRIVAL_DELAY', 'mean'].max() #Max-Wert der Skala
    },
    text= dfDA['text'], #Text für Hover wird zugewiesem
    name = "Arrival Delays" #Name für die Trace
))

#Update Layout für Anpassen der Darstellung und Hinzufügen der Buttens sowie des Textes
fig.update_layout(
    autosize = True, #Autosize an für korrektes resizing
    hovermode='closest', #Hovermode, damit man mit der Maus nicht genau über den Punkten hovern muss
    mapbox=dict( #Layout-Einstellungen für Mapbox. dict für gesammelte Darstellung und einfache Lesbarkeit
        accesstoken=mapbox_access_token, #Oben definiertes Access-Token zuweisen
        bearing=0, #Bearing beim Öffnen der Karte
        center= dict( #Koordinaten, die beim Öffnen der Karte in der Mitte sind als dict. Diese sind so gewählt, dass alle Punkte sichtbar sind
            lat= 50.5,
            lon= -115),
        pitch = 0, #Pitch beim Öffnen der Karte
        zoom = 2.5, #Zoom beim Öffnen der Karte. Dieser ist ebenfalls für die optimale Übersicht angepasst
        style="dark" #Farbschema auf Dunkel für verbesserten Kontrast
    ),
    title=dict( #Einstellungen für den Titel in dict für gesammelte Darstellung und einfache Lesbarkeit
        text="Verspätungen bei Ab-/ oder Anflug nach Flughäfen", #Text der Titels
        x = 0.5, #Verschiebung in x-Richtung
        xanchor="center", #x-Anker in der Mitte der Seite
        yanchor="top" #y-Anker oben
    ),
    updatemenus =[ #Array für Buttons
    dict(active=0, #Einzelne Buttons und Attribute in dict für gesammelte Darstellung und einfache Lesbarkeit
         type="buttons", #Type auf buttons für Buttons
         showactive = True, #Sichtbarkeit ein
         direction = "right", #Reihenfolge der einzelnen Buttons nach rechts
         xanchor="left", #x-Anker auf der linken Seite
         yanchor="bottom", #y-Anker unten, um klippen über die Überschrift zu verhindern
         x=0.15, #Angepasste Verschiebung in x-Richtung
         y=1.01, #Angepasste Verschiebung in y-Richtung
         buttons=list([ #Liste für alle Buttons 
            dict(label = "Startflughäfen", #Erster Button in dict mit Beschriftung
                 method = "update", #Methode update für das Anpassen der angezeigten Traces
                 args = [{"visible": [True, False]}]), #Über Boolsche-Variablen in einem Array wird festgelegt, welche Traces bei der Variable visible welchen Wert bekommt
            dict(label = "Endflughäfen", #Zweiter Button in dict mit Beschriftung
                 method = "update", #Methode update für das Anpassen der angezeigten Traces
                 args = [{"visible": [False, True]}]), #Über Boolsche-Variablen in einem Array wird festgelegt, welche Traces bei der Variable visible welchen Wert bekommt
            ]))],
    annotations=[ #Annotations für die Beschriftungen
        dict(text="Bitte wählen Sie den Flughafentyp:", #Annotation in dict für gesammelte Darstallung und einfache Lesbarkeit
             xanchor="left", #x-Anker auf der linken Seite
             yanchor="bottom", #y-Anker auf der unteren Seite, um klippen über die Überschrift zu verhindern
             x=0, #Verschiebung in x-Richtung
             y=1.018, #Angepasste Verschiebung in y-Richtung
             align="left", #Text linksbündig setzen
             showarrow=False) #Den bei Annotations normalerweise sichtbaren Pfeil unischtbar machen
    ]
)

fig.show() #Diagramm anzeigen

#fig.write_html("bubblemap.html", auto_open=True) #Als HTML speichern und direkt öffnen