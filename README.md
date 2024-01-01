# Grid-Mapper
Grid Mapper work with [WSJT-X](https://wsjt.sourceforge.io/) to display calling stations' grids on a map, display previously worked grids on a map, display the station's grid currently being worked on a map, and information about the station being worked showing up on a side panel. All in real time.

When I created this app I didn't realize a simmilar app called [GridTracker](https://gridtracker.org/) existed. For a more "kitchen sink" approach to this concept, give that app a try.

Color key:
* Green squares: Previously worked station grids.
* Yellow squares: Previously worked station grids currently calling CQ.
* Pink squares: New station grids currently calling CQ.
* Red square: Station currently being worked.
* Blue square: Your QTH.

![Grid Mapper v1.2.2](http://assets.midnightcheese.com/images/grid-mapper-v1.2.2.png "Grid Mapper v1.2.2")

## Releases
Release v1.2.2 ensures duplicate worked grid squares are no longer rendered which should help performance and eliminate the weird visual of several grids layered on top of one another. Visual style updates have been applied to grids and the side panel. 

Release v1.2 differentiates between grids calling CQ. Worked grids display as yellow while new grids display as pink. Clicking on the map displays that point's grid.

Head over to the [releases](https://github.com/Cale/Grid-Mapper/releases "releases") page for download options.

## Philosophy
Grid Mapper is designed for the casual FT8 user. It's primary function allows the operator to quickly see where the station being worked is located and easy access to that station's QRZ info. This solved a personal pain point of mine that involved lots of manual typing of callsigns and grid squares into various websites to get the same information. 

## Roadmap
Next steps include:
* OS X release
* ~~Linux ARM release~~
* ~~Map worked grids from the WSJT-X QSO history log~~
* Windows installer

## Feedback
If you have feedback, drop a note in the [Issues](https://github.com/Cale/Grid-Mapper/issues "Issues") section or find me (K4HCK) on Mastodon [@K4HCK](https://mastodon.radio/@K4HCK).
