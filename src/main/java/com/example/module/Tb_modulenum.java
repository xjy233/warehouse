package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_modulenum {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int modulenumID;
	private String department;
	private String brand;
	private String fitting;
	private String provider;
	private String size;
	private String colour;
	private String modulenum;
	
	public Tb_modulenum() {}

	public Tb_modulenum(String department, String brand, String fitting, String provider, String colour,
			String size,String moduleNum) {
		super();
		this.department = department;
		this.brand = brand;
		this.fitting = fitting;
		this.provider = provider;
		this.colour = colour;
		this.size = size;
		this.modulenum = moduleNum;
	}

	
	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public int getModuleNumID() {
		return modulenumID;
	}

	public void setModuleNumID(int moduleNumID) {
		this.modulenumID = moduleNumID;
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

	public String getColour() {
		return colour;
	}

	public void setColour(String colour) {
		this.colour = colour;
	}

	public String getModuleNum() {
		return modulenum;
	}

	public void setModuleNum(String moduleNum) {
		this.modulenum = moduleNum;
	}
	
}
