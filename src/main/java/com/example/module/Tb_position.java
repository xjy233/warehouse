package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_position{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int positionID;
	private String positionInfo;//与ID是一一对应的，不能重复
	private int volume = 35;
	private int occupation = 0;
	private String changeTime;//位子的变动时间
	private boolean station;//给位子上锁（1-未上锁，0-上锁）
	
	
	public Tb_position(){}
	
	

	public Tb_position(String positionInfo, int volume, int occupation, String changeTime, boolean station) {
		super();
		this.positionInfo = positionInfo;
		this.volume = volume;
		this.occupation = occupation;
		this.changeTime = changeTime;
		this.station = station;
	}



	public int getPositionID(){
		return this.positionID;
	}
	public void setPositionID(int positionID){
		this.positionID=positionID;
	}
	public String getPositionInfo(){
		return this.positionInfo;
	}
	public void setPositionInfo(String positionInfo){
		this.positionInfo=positionInfo;
	}
	public int getVolume(){
		return this.volume;
	}
	public void setVolume(int volume){
		this.volume=volume;
	}
	public int getOccupation(){
		return this.occupation;
	}
	public void setOccupation(int occupation){
		this.occupation=occupation;
	}
	
	public String getChangeTime() {
		return changeTime;
	}
	public void setChangeTime(String changeTime) {
		this.changeTime = changeTime;
	}
	public boolean isStation() {
		return station;
	}
	public void setStation(boolean station) {
		this.station = station;
	}
	
	
}