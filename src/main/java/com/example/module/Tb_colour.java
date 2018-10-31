package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_colour{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int colourID;
	private String colourInfo;
	
	
	public Tb_colour(){}
	public Tb_colour(String colourInfo) {
		super();
		this.colourInfo = colourInfo;
	}
	public int getColourID(){
		return this.colourID;
	}
	public void setColourID(int colourID){
		this.colourID=colourID;
	}
	public String getColourInfo(){
		return this.colourInfo;
	}
	public void setColourInfo(String colourInfo){
		this.colourInfo=colourInfo;
	}

}