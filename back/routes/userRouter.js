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


router.post("/launch", async(req,res) =>{
	try{
		const conn = mongoose.connection;
		const fs = require('fs');
		const path = require('path');
		const Grid = require('gridfs-stream');
		

		Grid.mongo = mongoose.mongo;

		//conn.once('open', () =>{
			log.info('- Connection open -');
			const gfs = Grid(conn.db);
		
			const fs_write_stream = fs.createWriteStream(path.join(__dirname,'gatherX.jar'));
			const readstream = gfs.createReadStream({
				filename: 'gatherX.jar'
			});
			readstream.pipe(fs_write_stream);
			
			fs_write_stream.on('close', () =>{
				log.info('File has been written fully');
				if(process.platform === "win32"){
					log.info("launching gatherx on a windows computer");
					exec(`java -jar ${__dirname}/gatherX.jar | cls "\\e[3J" -f`, (err, stdout, stderr) => {
						if (err) {
							log.info(`exec error: ${err}`);
							return;
						}
						});
				}else if (process.platform === "darwin"){
					log.info("launching gatherx on a mac computer");
					exec(`java -jar ${__dirname}/gatherX.jar | clear && printf '\\e[3J'`, (err, stdout, stderr) => {
						if (err) {
							log.info(`exec error: ${err}`);
							return;
						}
						});
				}

					log.info("launch complete");
					return res.json(true);
			})
			
		//});
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
/*
router.post("/tokenIsValid", async (req, res) => {
	try {
		const token = req.header("x-auth-token");
		if(!token) return res.json(false);

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		if(!verified) return res.json(false);

		const user = await User.findById(verified.id);
		if(!user) return res.json(false);

		return res.json(true);
	}catch(err){
		res.status(500).json({error: err.message});
		}
})
*/

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