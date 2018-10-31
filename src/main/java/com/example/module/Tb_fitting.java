package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_fitting{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int fittingID;
	private String fitting;
	
	public Tb_fitting() {}

	public Tb_fitting(String fitting) {
		super();
		this.fitting = fitting;
	}

	public int getFittingID() {
		return fittingID;
	}

	public void setFittingID(int fittingID) {
		this.fittingID = fittingID;
	}

	public String getFitting() {
		return fitting;
	}

	public void setFitting(String fitting) {
		this.fitting = fitting;
	}

}