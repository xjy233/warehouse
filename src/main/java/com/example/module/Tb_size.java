package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_size{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int sizeID;
	private String sizeInfo;
	
	
	public Tb_size(){}
	public Tb_size(String sizeInfo) {
		super();
		this.sizeInfo = sizeInfo;
	}
	public int getSizeID(){
		return this.sizeID;
	}
	public void setSizeID(int sizeID){
		this.sizeID=sizeID;
	}
	public String getSizeInfo(){
		return this.sizeInfo;
	}
	public void setSizeInfo(String sizeInfo){
		this.sizeInfo=sizeInfo;
	}

}