#IMPORTE
import pandas as pd
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots

#Dataframe aus CSV-Datei und Datentypen für schnelleres Einlesen angeben
df = pd.read_csv('../Data/flights_cleaned.csv', dtype={"YEAR": int, "MONTH": int, "DAY": int, "DAY_OF_WEEK": int, "AIRLINE": str, "AIRLINE_NAME": str, "FLIGHT_NUMBER": int, "TAIL_NUMBER": str, "ORIGIN_AIRPORT": str, "ORIGIN_AIRPORT_NAME": str, "ORIGIN_AIRPORT_LATITUDE": float, "ORIGIN_AIRPORT_LONGITUDE": float, "DESTINATION_AIRPORT": str, "DESTINATION_AIRPORT_NAME": str, "DESTINATION_AIRPORT_LATITUDE": float, "DESTINATION_AIRPORT_LONGITUDE": float, "SCHEDULED_DEPARTURE": int, "DEPARTURE_TIME ": float, "DEPARTURE_DELAY": float, "TAXI_OUT": float, "WHEELS_OFF": float, "SCHEDULED_TIME": float, "ELAPSED_TIME": float, "AIR_TIME": float, "DISTANCE": int, "WHEELS_ON": float, "TAXI_IN": float, "SCHEDULED_ARRIVAL": int, "ARRIVAL_TIME": float, "ARRIVAL_DELAY": float, "DIVERTED": int, "CANCELLED": bool, "CANCELLATION_REASON": object, "AIR_SYSTEM_DELAY": float, "SECURITY_DELAY": float, "AIRLINE_DELAY": float, "LATE_AIRCRAFT_DELAY": float, "WEATHER_DELAY": float})

#Figure-Objekt erstellen
fig = make_subplots(specs=[[{"secondary_y": True}]]) #Für diese Figure habe ich nicht die go-Variante verwendet, sondern subplots-Variante, um eine sekundäre y-Achse anzeigen zu können

#Dataframe, welches nach dem Datum gruppiert ist. Über die aggregation-Funktion werden die benötigten Werte mit der passenden Aggregierungsfunktion gespeichert
dfDate = df.groupby('DATE').agg({'DEPARTURE_DELAY': ['mean', 'median'], 'ARRIVAL_DELAY': ['mean', 'median'], 'FLIGHT_NUMBER': 'count'}).reset_index()

#Erste Trace mit den Abflugsverspätungen
fig.add_trace(go.Scatter( #Scatter Trace zu der Figure hinzufügen
    x=list(dfDate['DATE']), #x-Achse ist das Datum
    y=list(dfDate['DEPARTURE_DELAY', 'mean']), #y-Achse sind die Abflugsverspätung aggragiert mit mean
    orientation='h', #Horizontale Orientierung
    name= chr(216) + " Abflugsverspätung", #Name der Trace. Das Durschsnittszeichen ist hier mit dem ASCII-Code eingefügt
    marker=dict(color='Blue'), #Farbe der Trace
    showlegend=True, #Trace auf der Legende anzeigen
    hoverlabel = dict(namelength = -1)), #Damit der gesamte Name der Trace, sowie der Wert vollständig angezeigt werden, muss die namelength auf -1 gesetzt werden
    secondary_y=False, #Diese Trace benutzt nicht die sekundäre y-Achse
    )

#Zweite Trace mit den Ankunftsverspätungen
fig.add_trace(go.Scatter( #Scatter Trace zu der Figure hinzufügen
    x=list(dfDate['DATE']), #x-Achse ist das Datum
    y=list(dfDate['ARRIVAL_DELAY', 'mean']), #y-Achse sind die Ankunftsverspätungen aggregiert mit mean
    orientation='h', #Horizontale Orientierung
    name= chr(216) + " Ankunftssverspätung", #Name der Trace. Das Durschnittszeichen ist hier mit dem ASCII-Code eingefügt
    marker=dict(color='Green'), #Farbe der Trace
    showlegend=True, #Trace auf der Legende anzeigen
    hoverlabel = dict(namelength = -1)), #Damit der gesamte Name der Trace, sowie der Wert vollständig angezeigt werden, muss die namelength auf -1 gesetzt werden
    secondary_y=False, #Diese Trace benutzt nicht die sekundäre y-Achse
    )

#Dritte Trace mit der Anzahl der Flügen
fig.add_trace(go.Scatter( #Scatter Trace zu der Figure hinzufügen
    x=list(dfDate['DATE']), #x-Achse ist das Datum
    y=list(dfDate['FLIGHT_NUMBER', 'count']), #y-Achse sind die Anzahl der Flugnummern aggregiert mit count. Es hätte hier auch jede andere Spalte mit count verwendet werden können.
    orientation='h', #Horizontale Orientierung
    name="Anzahl der Flüge", #Name der Trace
    marker=dict(color='Red'), #Farbe der Trace
    showlegend=True, #Trace auf der Legende anzeigen
    hoverlabel = dict(namelength = -1)), #Damit der gesamte Name der Trace, sowie der Wert vollständig angezeigt werden, muss die namelength auf -1 gesetzt werden
    secondary_y = True, #Diese Trace benutzt die sekundäre y-Achse
    )

#Anpassen des Figure Layouts
fig.update_layout( #update_layout Funktion aufrufen
    title="Anzahl der Flüge zu Verspätung", #Titel hinzufügen
    hovermode="x unified", #Damit beim Hovern alle Werte, sowie der senkrechte Strich angezeigt werden, muss der hovermode auf 'x unified' gesetzt werden
    xaxis=dict( #Einstellungen für die x-Achse in einem dict. Dadurch können die einzelnen Parameter gesammelt dargestellt und die Lesbarkeit verbessert werden
        rangeselector=dict( #Rangeselector erstellen. Dieser ermöglicht es sowohl über Buttons, als auch einen Slider den Zeitraum des Diagramms anzupassen
            buttons=list([ #Buttons für vordefinierte Zeiträume in Liste
                dict(count=1, #Erster Button für einen Monat
                     label="1 Month", #Beschriftung des Buttons
                     step="month", #Step bestimmt, welche Einheit die bei 'count' angegebene Zahl hat; Hier Monat
                     stepmode="backward"), #Stepmode gibt an, von welchem Zeitpunk an das Zeitintervall gilt. Hier einen Monat rückwärts von dem letzten Tag im Dataframe
                dict(count=3, #Zweiter Button für drei Monate
                     label="3 Months", #Beschriftung des Buttons
                     step="month", #Step bestimmt, welche Einheit die bei 'count' angegebene Zahl hat; Hier Monat
                     stepmode="backward"), #Stepmode gibt an, von welchem Zeitpunkt an das Zeitintervall gilt. Hier drei Monate rückwärts von dem letzten Tag im Dataframe
                dict(count=6, #Dritter Button für sechs Monate
                     label="6 Monts", #Beschriftung des Buttons
                     step="month", #Step bestimmmt, welche Einheit die bei 'count' angegebene Zahl hat; Hier Monat
                     stepmode="backward"), #Stepmode gibt an, von welchem Zeitpunk an das Zeitintervall gilt. Hier sechs Monate rückwärts von dem letzten Tag im Dataframe
                dict(step="all") #Vierter Button. Der step 'all' ist vordefiniert und zeigt den gesamten Zeitraum an. Daher sind hier keine weiteren Definitionen notwendig
            ])
        ),
        rangeslider=dict( #Optionen für den Rangeslider. Bei diesem sind ebenfalls schon die meisten Attribute passend vorgegeben
            visible=True #Daher muss dieser lediglich sichtbar gemacht werden
        ),
        type="date" #Festlegen, welche Einheit für den Rangeselector verwendet wird; Hier date
    ),
    updatemenus =[ #Einfügen der Updatemenus
    dict(active=3, #Dict für alle Updateelemente. Dies ermöglicht eine gesammele Darstellung und erhöht die Lesbarkeit. Die Zahl, welche active zugewiesen wird gibt an, welches Element beim Öffnen der Figure als aktiv angezeigt wird
         type="buttons", #Art der updatemenus auf Buttons setzen
         buttons=list([ #Liste mit allen Button. Hier wird ebenfalls die Lesbarkeit erhöht
            dict(label = "Durchschnittliche Verspätungen", #Beschriftung des ersten Buttons
                 method = "update", #Festlegen der update-Methode; Hier update
                 args = [{"visible": [True, True, False]}]), #Über ein Array, welches mit boolschen Werten befüllt ist, wird festgelegt bei welchen Traces die visibilit auf True bzw. False gesetzt wird
            dict(label = "Anzahl der Flüge", #Beschriftung des zweiten Buttons
                 method = "update", #Festlegen der update-Methode; Hier update
                 args = [{"visible": [False, False, True]}]), #Über ein Array, welches mit boolschen Werten befüllt ist, wird festgelegt bei welchen Traces die visibilit auf True bzw. False gesetzt wird
            dict(label = "All", #Beschriftung des zweiten Buttons
                 method = "update", #Festlegen der update-Methode; Hier update
                 args = [{"visible": [True, True, True]}]), #Über ein Array, welches mit boolschen Werten befüllt ist, wird festgelegt bei welchen Traces die visibilit auf True bzw. False gesetzt wird
            ]),
            pad={"r": 0, "t": 0}, #Padding für die Buttons
            showactive=True, #Visuelles Feedback, welcher Button (welches Layout) gerade ausgewählt ist, an
            x=0.939, #Verschiebung der Buttons in x-Richtung
            xanchor="right", #x-Anker auf der rechten Seite
            y=1, #Verschiebung der Buttons in y-Richtun
            yanchor="bottom", #y-Anker unten, um clipping über die Überschrift zu verhindern
            direction="right" #Richtung, in die die Buttons nebeneinander angeordnet werden
            )]
)

fig.update_xaxes(title_text="Datum 2015") #Beschriftung für die x-Achse hinzufügen
fig.update_yaxes(title_text="Durschnittliche Verspätung in Minuten", secondary_y=False, color='Black') #Beschriftung für die primäre y-Achse hinzufügen
fig.update_yaxes(title_text="Anzahl der Flüge", secondary_y=True, color='Red') #Beschriftung für die sekundäre y-Achse hinzufügen
fig.update_yaxes(rangemode="tozero") #Erzwingen, dass beide y-Achsen einen Nullpunkt haben, um die Darstellung intuitiver und übersichtlicher zu machen

fig.show() #Figure anzeigen

#fig.write_html("scatter.html", auto_open=True) #Figure anzeigen und direkt als hmtl-Datei speichern.