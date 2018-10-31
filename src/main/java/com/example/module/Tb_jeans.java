package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_jeans{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int jeansID;
	private String moduleNum;
	private String department;
	private String brand;
	private String fitting;
	private String provider;
	private String size;
	private	String colour;
	private String packageId;
	private int amount;	//裤子入库时的总数
	private int nowNum;	//该类型裤子现有数量
	private float jeaWeight;//该类型裤子总重量
	private boolean station;//裤子是否出库的状态（0-未出库，1-出库）
	private boolean lockStation;//裤子锁状态（1-未上锁，0-上锁）
	
	
	public Tb_jeans(){}

	

	public Tb_jeans(String moduleNum, String department, String brand, String fitting, String provider,
			String size, String colour, String packageId, int amount, int nowNum, float jeaWeight, boolean station,
			boolean lockStation) {
		super();
		this.moduleNum = moduleNum;
		this.department = department;
		this.brand = brand;
		this.fitting = fitting;
		this.provider = provider;
		this.size = size;
		this.colour = colour;
		this.packageId = packageId;
		this.amount = amount;
		this.nowNum = nowNum;
		this.jeaWeight = jeaWeight;
		this.station = station;
		this.lockStation = lockStation;
	}



	public float getJeaWeight() {
		return jeaWeight;
	}

	public void setJeaWeight(float jeaWeight) {
		this.jeaWeight = jeaWeight;
	}

	public int getJeansID() {
		return jeansID;
	}

	public void setJeansID(int jeansID) {
		this.jeansID = jeansID;
	}

	public String getModuleNum() {
		return moduleNum;
	}

	public void setModuleNum(String moduleNum) {
		this.moduleNum = moduleNum;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getFitting() {
		return fitting;
	}

	public void setFitting(String fitting) {
		this.fitting = fitting;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public String getColour() {
		return colour;
	}

	public void setColour(String colour) {
		this.colour = colour;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public int getNowNum() {
		return nowNum;
	}

	public void setNowNum(int nowNum) {
		this.nowNum = nowNum;
	}

	public boolean getStation() {
		return station;
	}

	public void setStation(boolean station) {
		this.station = station;
	}

	public String getPackageId() {
		return packageId;
	}

	public void setPackageId(String packageId) {
		this.packageId = packageId;
	}

	public boolean isLockStation() {
		return lockStation;
	}

	public void setLockStation(boolean lockStation) {
		this.lockStation = lockStation;
	}
	

}