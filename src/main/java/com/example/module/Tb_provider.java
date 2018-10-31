package com.example.module;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Tb_provider{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int providerID;
	private String provider;
	
	
	public Tb_provider(){}
	public Tb_provider(String provider) {
		super();
		this.provider = provider;
	}
	public int getProviderID(){
		return this.providerID;
	}
	public void setProviderID(int providerID){
		this.providerID=providerID;
	}
	public String getProvider(){
		return this.provider;
	}
	public void setProvider(String provider){
		this.provider=provider;
	}

}