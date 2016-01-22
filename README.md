## StepProgressBar [IN PROGRESS]

Progress bars are a bit limited when you want to display several steps on it (usually the bar starts at 0 and finishes at 100, so current value is in percents).

The aim of this plugin is to easily build fully customizable progress bar, that can handle more than one single step.

## Installation

For now, the plugin has only dependencies with jQuery, so you can include it like following with plugin's js & css files.

## Usage

**HTML**
```html
    <head>
        <link href="path/to/plugin/jquery.StepProgressBar.css" rel="stylesheet">
    </head>
    <body>
        <div id="element"></div>
        <script src="path/to/jquery/jquery.js"></script>
        <script src="path/to/plugin/jquery.StepProgressBar.js"></script>
    </body>
```

**JAVASCRIPT**
```javascript
    $(document).ready(function() {
        $('#element').stepProgressBar({
            currentValue: 50,
            steps: [
                {value: 0},
                {value: 100}
            ]
        });
    });
```

## License

The plugin is under MIT License
