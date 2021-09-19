<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
        <title>Speech Recognition</title>
		<!--
		

        <link rel="stylesheet" href="https://www.rps34.com/cdn/fw/rjs.css">
        <script src="https://www.rps34.com/cdn/fw/rjs.js"></script>
		<script src="https://www.rps34.com/cdn/fw/jquery.js"></script>
		-->
        <link rel="stylesheet" href="css/style.css">
        

    </head>
    <body class="">	
		<div class="main-container">
			<div>
				<div class="btn-container">
					<button id="srButton" class="sr_button">Click to speak</button>
					<button id="copyButton" class="copy_button">Copy</button>
				</div>
				<div id="resultContainer" contenteditable="true"></div>
			</div>
		</div>
		<div id="messages_div" class="messages_div">
			<div class="hidder_div">
				<!--
				<div class="message active"><div>Entered</div></div>
				<div class="message active"><div>Entered</div></div>
				<div class="message active"><div>Entered</div></div>
				<div class="message active"><div>Entered</div></div>
				<div class="message active"><div>Entered</div></div>
				-->
			</div>
			<div class="style_div"></div>
		</div>
		
		<script src="js/clipboard.min.js"></script>
		<script src="js/script.js"></script>
	</body>
</html>