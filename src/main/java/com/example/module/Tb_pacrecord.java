package com.example.module;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_pacrecord{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int recordID;
	private String packageID;
	private Timestamp intTime;
	private Timestamp outTime;
	private String inUsername;
	private String outUsername;
	
	
	public Tb_pacrecord(){}
	
	public Tb_pacrecord(String packageID, Timestamp intTime, String inUsername) {
		super();
		this.packageID = packageID;
		this.intTime = intTime;
		this.inUsername = inUsername;
	}



	public int getRecordID(){
		return this.recordID;
	}
	public void setRecordID(int recordID){
		this.recordID=recordID;
	}
	
	public String getPackageID() {
		return packageID;
	}
	public void setPackageID(String packageID) {
		this.packageID = packageID;
	}
	public Timestamp getIntTime(){
		return this.intTime;
	}
	public void setIntTime(Timestamp intTime){
		this.intTime=intTime;
	}
	public Timestamp getOutTime(){
		return this.outTime;
	}
	public void setOutTime(Timestamp outTime){
		this.outTime=outTime;
	}

	public String getInUsername() {
		return inUsername;
	}
	public void setInUsername(String inUsername) {
		this.inUsername = inUsername;
	}
	public String getOutUsername() {
		return outUsername;
	}
	public void setOutUsername(String outUsername) {
		this.outUsername = outUsername;
	}

	
}