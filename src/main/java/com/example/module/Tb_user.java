package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table
public class Tb_user{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int userID;
	private String username;
	private String password;
	private String name;
	private String workNumber;
	private String phone;
	private int extras;//0-不能查看出库货物记录，1-能查看
	private String initPassword;//初始密码
	private int userType;
	private String eMail;
	
	public Tb_user(){}
	
	
	public Tb_user(String username, String password, String name, String workNumber, String phone,
			int extras, String initPassword, int userType,String eMail) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.workNumber = workNumber;
		this.phone = phone;
		this.extras = extras;
		this.initPassword = initPassword;
		this.userType = userType;
		this.eMail = eMail;
	}


	public int getUserID(){
		return this.userID;
	}

	public void setUserID(int userID){
		this.userID=userID;
	}
	public String getUsername(){
		return this.username;
	}
	public void setUsername(String username){
		this.username=username;
	}
	public String getPassword(){
		return this.password;
	}
	public void setPassword(String password){
		this.password=password;
	}
	public String getName(){
		return this.name;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getWorkNumber(){
		return this.workNumber;
	}
	public void setWorkNumber(String workNumber){
		this.workNumber=workNumber;
	}
	public int getUserType(){
		return this.userType;
	}
	public void setUserType(int userType){
		this.userType=userType;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}

	public int getExtras() {
		return extras;
	}

	public void setExtras(int extras) {
		this.extras = extras;
	}

	public String getInitPassword() {
		return initPassword;
	}

	public void setInitPassword(String initPassword) {
		this.initPassword = initPassword;
	}


	public String geteMail() {
		return eMail;
	}


	public void seteMail(String eMail) {
		this.eMail = eMail;
	}
	
	
}