# Coolrelation: Super Fast and Easy Correlation Matrix Visualization Generator

## THE PROJECT

D3 is an incredibly power data visualization tool written in javascript. But in order to use it, it requires some basic understanding of HTML, SVG , CSS and Javascript. Therefore, I build Coolrelation, a D3 visualization generator for correlation data. It currently has two different graphs that helps user to explore the structure and find insights out of their correlation matrix data.

### What is a correlation?

__Correlation__ ([wikipedia](https://en.wikipedia.org/wiki/Correlation_and_dependence)) is how two variables move together. Traditionally, we use correlation matrix to explore the correlation of each pair. However, it's not a easy task to get the whole picture when the matrix size is big. Therefore, a visualization tool will be extremely helpful in a case like this.


### HOW IT WORKS?

![screenshoot of index page]

An app like this should be very easy and intuitive for user. So I made the UI very simple and clean. In order to maximize user experience, it doesn't require user to signup or login before they try it out. User can go directly to the generator and upload their correlation matrix csv data (the file must be formated in a certain way so that the data can be processed correctly. see __DATA FORMAT__ section for more detail.) 


### DATA FORMAT

![screenshoot of csv file](https://github.com/mrtial/coolrelation/blob/master/client/assets/data_format.png "CSV File Format")


In order to process the data, user needs to format the csv file in a certain way. 

The file user provide should contain the __correlation matrix__ itself __AND__ a __groups column__ which specified each groups in their data. Colors will be automatically assigned to each group.



## D3 MODEL & GRAPHS

### Force-Directed Graph

![graph 1](https://github.com/mrtial/coolrelation/blob/master/client/assets/graph1.png)

Force-directed graph drawing algorithms assign forces among the set of edges and the set of nodes of a graph drawing. Spring-like attractive forces based on Hooke's law are used to attract pairs of endpoints of the graph's edges towards each other, while simultaneously repulsive forces like those of electrically charged particles based on Coulomb's law are used to separate all pairs of nodes. In this project, the spring-like attractive forces are proportional to the correlation between two nodes. If the correlation is negative, a repulsive force will be enforced.

Nodes start from random position. In equilibrium states for this system of forces, a node would tend to end up at a position that is closer to the group of nodes which it is higher correlated with, and be drawn further apart from the group of nodes which it is not (or even negatively) correlated with.


### Schemaball Graph

![graph 2](https://github.com/mrtial/coolrelation/blob/master/client/assets/graph2.png)

Schemaball is a flexible schema visualizer for correlation. Structure graphs described above allow nodes to be display in a 2-dimensional pattern, which can sometime be overcomplicated and overwhelming. In the schemaball layout, we apply the same forces mentioned in the structure graph section. In addition, we introduce a new force to the circumference of a circle. This reduce the structure graphs to a 1-dimensional graph, which sometime gives a clearer look and better intuition. Also, in this graph we assume edges themselves would have attractive force to bend them toward other edges. Therefore, an edge won’t be just a straight line like structure graph, and it helps to observe the clustering structure between nodes.



### Graph Style Settings

* __Graph type :__ switch between two graph with same csv data

* __Color schema :__ standard d3 scaler

* __Node_size ( 4 - 10 ) :__ the size of the node circle

* __Link_width ( 0 -3 ) :__ the width between 2 nodes, the larger correlation between the two, the wider the link is.

* __Display_cutoff :__ Only show the edges when the correlation is higher than the cutoff. Please note that even if the correlation is lower than the cutoff and therefore is not shown in the graph, it will still work under the background to move the nodes accordingly.
 


## CONTACT INFO


Coolrelation is a work-in-progress project. Some functionalities are still under development. It currently has two different types of graphs for user to choose from. However, in the future, it will gradually adds more graph options alone with graph settings. If you have any suggestions or feedbacks, please feel free to reach out to me. Thanks!

