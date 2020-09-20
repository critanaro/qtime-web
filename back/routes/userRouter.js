const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Xray = require("x-ray");
const { exec } = require('child_process');
const homeDir = require('os').homedir();
const desktopDir = `${homeDir}/Desktop`;
//for gridfs
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const Schema = mongoose.Schema;
const log = require('electron-log');

		
//checkin 
router.post("/checkin", async(req,res) =>{
	try{

		var timeVal = Date.now();
		console.log("I've checked in :o");
		console.log(timeVal);
		return res.json({startTime: timeVal});
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

//checkout
router.post("/checkout", async(req,res) =>{
	try{
		
		var timeVal2 = Date.now();
		console.log("I've checked out :o");
		console.log(timeVal2);
		return res.json({endTime: timeVal2});
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

//update: is called to redefine all of the colors
router.post("/update", async(req,res) =>{
	try{	
		//gonna need to feed in a CSV with the times (compiled from the checkin checkout codes)
		var shapeOld = parseFloat(req.body.shape);
		var rangeOld = parseFloat(req.body.range);
		var dsetOld = req.body.dset;
		var l1Old= req.shape;
		var l2Old = req.range;
		var socialdistOld= req.dset;

		let bayesOut = [];

		//get the output of Steven's script --> list of avg value for time, shape, range 
		//latter two are used to calibrate the next model
		var currentPath = process.cwd();

		console.log(shapeOld);
		exec(`python3 ${currentPath}/data-anal/bayes.py days/dummy_coffee_data.csv 0.5 0 30 30 5`, (err, stdout, stderr) => {
			bayesOut = stdout.toString().split(',');
			console.log(stdout);
			//console.log(`this is the output of the Steven function: ${bayesOut[0]}`);
			if (err) {
				console.log(`exec error at Steven: ${err}`);
				return;
			}
			var i;
			var avgs = [];
			var colors = [];
			var shape = [];
			var range = [];
			var cil = [];
			var ciu = [];
			

			for(i = 0; i<bayesOut.length-5; i++){
				if(i%6 == 0){
					avgs.push(parseInt(bayesOut[i]));
					colors.push(bayesOut[i+1]);
					shape.push(bayesOut[i+2]);
					range.push(bayesOut[i+3]);
					cil.push(bayesOut[i+4]);
					ciu.push(bayesOut[i+5]);
				}
			}
				return res.json({avgs: avgs, colors: colors, shape: shape, range: range, 
				cil: cil, ciu: ciu});
		});
		//this should return the value of the final array of colors
		
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

// logging in a user
router.post("/login", async(req,res) =>{
	try{
		const {email, password} = req.body;
		
		var xray = new Xray();
		//https://www.gatherxanalytics.com/licensing?username=%22hughjcoleman%40gmail.com%22&key=%22gt0n4650c68c62550%22&token=%22adskjfadhfajkalfdhU3249324%22
		let url = 'https://www.gatherxanalytics.com/licensing?username=\"' + email + '\"&key=\"'+ password + '\"&token='+'\"adskjfadhfajkalfdhU3249324\"';
		xray(encodeURI(url), '.font_7')(function(err, item) {
			if(item === '1'){
				return res.json(true);
			}else{
				return res.json(false);
			}
		})
	
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

router.get("/", async (req, res) => {
	try{
		const user = await User.findById(req.user);
		res.json({
			displayName: user.displayName,
			id: user._id,
		});
	} catch(err){
		res.status(500).json({error: err.message});
		}
})


module.exports = router;