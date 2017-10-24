const {spawn} = require('child_process');

const child = spawn('node', ['solution.js'], {
	detached: false,
	stdio: 'inherit'
});


setTimeout(() => {
	child.kill();
}, 1400);