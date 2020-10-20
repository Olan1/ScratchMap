# ScratchMap
The aim of this project is to allow users to tracks and monitor the countries they have visited visually by creating a digital version of a scratchmap.

## Demo

Click [here](https://olan1.github.io/ScratchMap/) for a sneak peek...

## UX

The following user cases were used to define the apps functionality (names have been changed for privacy purposes):
 
###### Colum:
> I will be travelling the globe for 18 months starting January. I want to keep a log of where I'm going, and where I've been.

###### Hannah:
> It would be handy to be able to highlight the countries I don't want to visit, as well as the ones I do.

###### Sean:
> I'd like to be able to share my map and view the maps of friends.

The functional requirements based on these cases are:
- More map options than just been / not been (eg. want to visit, don't want to visit, etc.).
- The ability to save your map data.
- A log of your map selections.
- Statistics on each map option.
- Statistics to visualise your journey.
- The ability to share your map with others, and to see their maps.

### Wireframes:
![Desktop Site Wireframe](https://raw.githubusercontent.com/Olan1/ScratchMap/master/assets/wireframes/home.html%20(desktop).png)

![Mobile Site Wireframe](https://raw.githubusercontent.com/Olan1/ScratchMap/master/assets/wireframes/home.html%20(Mobile).png)

## Technologies
1. HTML5.
2. CSS3.
3. JavaScript.
4. Bootstrap (4.3.1).
5. jQuery.
6. jVectorMap.
7. D3.js.
8. Crossfilter.
9. dc.js.

## Features

### Existing Features
The map is fully interactive. Hovering over a country displays the country's name in a tooltip. Clicking a country prompts a modal. The modal displays the country clicked, and all options available. Each option highlights the region with a specified colour.

These modal buttons also interact with the board and statistics sections. Once an option is selected, a bubble containing the selected country's name appears on the board. The bubble appears under the heading of the selected option and in the colour related to that option.

Each time an option is clicked, the data used by the graphs is updated and the graphs are redrawn.

### Features Left to Implement
The ability for users to share maps is yet to be implemented. This would require users creating profiles that their map data could be saved to, as opposed to their device's local storage. This would a require backend framework.

## Testing
### Code Validation:
The HTML code was validated using [The W3C Markup Validation Service](https://validator.w3.org/).

The CSS code was validated using [The W3C CSS Validation Service - Jigsaw](https://jigsaw.w3.org/css-validator/).

The JavaScript code was validated using [JSHint](https://jshint.com/), [Code Beautify](https://codebeautify.org/jsvalidate), and [Esprima](https://esprima.org/demo/validate.html).

The JSON data was validated using [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/).

### UX Testing:
Testing was carried out manually in multiple browsers (chrome, firefox, safari, and edge). Testing was also carried out on multiple screen sizes using google chrome developer tools.

Below shows the testing structure used:
![Testing Workflow](https://raw.githubusercontent.com/Olan1/ScratchMap/master/assets/wireframes/testflow.png)

A country was selected. From the pop-up modal, the home option was selected. The map was observed for the correct colour change, the board was observed for the bubble appearing in the correct board with the correct contents and colour. The charts were observed for updating correctly.

The same country was clicked and the next option was selected. The colour change was observed on the map. On the board, it was checked that the bubble had moved to the correct section, changed to the expected colour, and still contained the correct content.

This was repeated on the same country for all modal options. The same country was then selected and the home option was clicked on the modal. Another country was then clicked and the home option was selected on the modal. The map was observed to check that only the most recently selected home country had a green fill. The other was observed to have a gold fill.

On the board section, when multiple home countries were selected, it was observed that only one bubble appeared in green in the home section. This bubble contained the correct content, displaying the most recently selected home countries name.
This was repeated for all countries.

To test the reset map modal option, multiple countries were selected on the map with different modal options for each. The reset map modal option was clicked. The map was observed to ensure all countries had a gold fill. The board was observed to ensure no bubbles were displaying under each board heading. The charts were observed to display the correct info. This was repeated several times with different country and modal option selection combinations, including with every country selected.

The pop-up modal was tested for closing after clicking the X icon, the close modal button, by clicking outside of the modal, and on click of every modal option.

Testing was carried out by myself and several friends, who followed the above testing structure, each taking a single continent. Once testing was completed, I asked them to try to break the site. They failed.

An issue found during testing was the map zoom and render location before and after clicking. If a region was selected while zoomed in, the map renders a new map fully zoomed out. I have been unsuccessful in fixing this issue and have unfortunately run out of time allocated for this project.

## Deployment
Github was used for version control.

This site is hosted on GitHub. It is deployed directly by the master branch and will automatically update upon new commits to the master branch.

The live site can be found [here](https://olan1.github.io/ScratchMap/).

## Credits

### Content
- Map sourced from [jVectorMap](http://jvectormap.com/).
- data.json country Ids sourced from [jVectorMap](http://jvectormap.com/).
- country-list.json sourced from [npm](https://www.npmjs.com/package/country-list).
- All externally sourced code referenced in files.

### Media

- Map icon sourced from [Free Icons Library](https://icon-library.net/icon/png-map-icon-0.html).

### Acknowledgements
- Thank you to everyone who helped with the inception of this project and with the endless, monotonous testing.

This site is for educational purposes.
