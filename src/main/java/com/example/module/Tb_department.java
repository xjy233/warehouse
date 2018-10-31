package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_department {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int departmentID;
	private String department;
	
	public Tb_department() {}
	public Tb_department(String department) {
		super();
		this.department = department;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	
	
}
