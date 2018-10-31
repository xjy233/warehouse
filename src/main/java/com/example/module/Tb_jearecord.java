package com.example.module;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_jearecord {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int jeaRecordID;
	private int jeansID;
	private Timestamp inTime;
	private String inUsername;
	private int nowNum;//现有裤子数量
	private Timestamp outTime;
	private String outUsername;
	private int outNum;//出库数量
	
	public Tb_jearecord() {}

	public Tb_jearecord(int jeansID, Timestamp inTime, String inUsername, int nowNum) {
		super();
		this.jeansID = jeansID;
		this.inTime = inTime;
		this.inUsername = inUsername;
		this.nowNum = nowNum;
	}

	public int getJeaRecordID() {
		return jeaRecordID;
	}

	public void setJeaRecordID(int jeaRecordID) {
		this.jeaRecordID = jeaRecordID;
	}

	public int getJeansID() {
		return jeansID;
	}

	public void setJeansID(int jeansID) {
		this.jeansID = jeansID;
	}

	public Timestamp getInTime() {
		return inTime;
	}

	public void setInTime(Timestamp inTime) {
		this.inTime = inTime;
	}

	public String getInUsername() {
		return inUsername;
	}

	public void setInUsername(String inUsername) {
		this.inUsername = inUsername;
	}

	public int getNowNum() {
		return nowNum;
	}

	public void setNowNum(int nowNum) {
		this.nowNum = nowNum;
	}

	public Timestamp getOutTime() {
		return outTime;
	}

	public void setOutTime(Timestamp outTime) {
		this.outTime = outTime;
	}

	public String getOutUsername() {
		return outUsername;
	}

	public void setOutUsername(String outUsername) {
		this.outUsername = outUsername;
	}

	public int getOutNum() {
		return outNum;
	}

	public void setOutNum(int outNum) {
		this.outNum = outNum;
	}


	
}
