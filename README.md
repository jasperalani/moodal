# moodal
### (vanilla) javascript and typescript modal

<center>
    <img src="images/mascot.png" width="400"/>
</center>

When I refer to <i>JTS</i>, I mean <i>javascript and typescript</i>.

## features
- semi-transparent background overlay (behind modal)
    - modal can be closed by clicking on the overlay
    - modal can be closed by clicking on the close button
    - modal can be closed by pressing the escape key
    - modal can be closed by clicking on the background overlay
- dynamic content
    - set title, subtitle, descriptions (no limit), buttons (no limit) dynamically with <i>JTS</i>
    - grab content using <i>JTS</i> functions
- mobile friendly
    - completely responsive and 100% screen size tested
- no dependencies
    - no external dependencies like jquery or css frameworks
    - all done in vanilla <i>JTS</i> and vanilla CSS (SCSS used for development?)
- extremely quick
    - goal: modal can be opened and closed in less than 100ms
- style customisation
    - customise modal style with XXXXXXXXXXX (how to customise modal style?)
    
## built from [cheatsnake/ModalWindow](https://github.com/cheatsnake/ModalWindow)

## dev setup
```bash
git clone https://github.com/jasperalani/moodal.git
cd moodal
npm init
# install ts globally
npm install -g typescript
# install ts locally
npm install --save-dev typescript
npx tsc --init
```