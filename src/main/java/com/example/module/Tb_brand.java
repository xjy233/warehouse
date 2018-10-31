package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_brand {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int brandID;
	private String brand;
	
	public Tb_brand() {}

	public Tb_brand(String brand) {
		super();
		this.brand = brand;
	}

	public int getBrandID() {
		return brandID;
	}

	public void setBrandID(int brandID) {
		this.brandID = brandID;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}
	
}
