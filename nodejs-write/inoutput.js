const args = process.argv;
console.log("hello " + args[2] + "!");
if (args[2] === "Junehyeop") {
	console.log("you got great access of macOS");
} else {
	console.log("access denied");
}
