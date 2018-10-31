package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_shelf{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int shelfID;
	private int shelfRow;
	private int shelfCol;
	private int pacAmount;//每个位子能放多少包
	private String shelfNumber;//货架号
	
	
	public Tb_shelf(){}
	
	public Tb_shelf(int shelfRow, int shelfCol, int pacAmount, String shelfNumber) {
		super();
		this.shelfRow = shelfRow;
		this.shelfCol = shelfCol;
		this.pacAmount = pacAmount;
		this.shelfNumber = shelfNumber;
	}

	public int getShelfID(){
		return this.shelfID;
	}
	public void setShelfID(int shelfID){
		this.shelfID=shelfID;
	}
	public int getShelfRow(){
		return this.shelfRow;
	}
	public void setShelfRow(int shelfRow){
		this.shelfRow=shelfRow;
	}
	public int getShelfCol(){
		return this.shelfCol;
	}
	public void setShelfCol(int shelfCol){
		this.shelfCol=shelfCol;
	}
	public String getShelfNumber(){
		return this.shelfNumber;
	}
	public void setShelfNumber(String shelfNumber){
		this.shelfNumber=shelfNumber;
	}
	public int getPacAmount() {
		return pacAmount;
	}
	public void setPacAmount(int pacAmount) {
		this.pacAmount = pacAmount;
	}
	
}