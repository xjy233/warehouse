package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;



@Entity
@Table
public class Tb_package{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int ID;
	private String packageID;	//包裹唯一ID
	private int amount;			//包裹裤子总数量
	private float weight;		//裤子总重量
	private String positionInfo;
	private int nowNum;			//包裹里现有的裤子数量
	private int ifOut;			//包裹是否出库的状态（0-未出库，1-出库,2-中间态）
	private boolean ifProblem;	//定义包裹是否数量有问题的状态
	
	public Tb_package(){}

	

	public Tb_package(int amount,int nowNum,float weight, String positionInfo, int ifOut, boolean ifProblem) {
		super();
		this.amount = amount;
		this.nowNum = nowNum;
		this.weight = weight;
		this.positionInfo = positionInfo;
		this.ifOut = ifOut;
		this.ifProblem = ifProblem;
	}

	
	public int getNowNum() {
		return nowNum;
	}

	public void setNowNum(int nowNum) {
		this.nowNum = nowNum;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getPackageID() {
		return packageID;
	}

	public void setPackageID(String packageID) {
		this.packageID = packageID;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public float getWeight() {
		return weight;
	}

	public void setWeight(float weight) {
		this.weight = weight;
	}

	public String getPositionInfo() {
		return positionInfo;
	}

	public void setPositionInfo(String positionInfo) {
		this.positionInfo = positionInfo;
	}

	public int isIfOut() {
		return ifOut;
	}

	public void setIfOut(int ifOut) {
		this.ifOut = ifOut;
	}

	public boolean isIfProblem() {
		return ifProblem;
	}

	public void setIfProblem(boolean ifProblem) {
		this.ifProblem = ifProblem;
	}

	

	
}