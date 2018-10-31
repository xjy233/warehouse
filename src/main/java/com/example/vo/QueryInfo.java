package com.example.vo;

import java.util.List;

public class QueryInfo {

	private boolean station;
	private List<query> conditions;
	private String packageId;
	public String getPackageId() {
		return packageId;
	}
	public void setPackageId(String packageId) {
		this.packageId = packageId;
	}
	public boolean isStation() {
		return station;
	}
	public void setStation(boolean station) {
		this.station = station;
	}
	public List<query> getConditions() {
		return conditions;
	}
	public void setConditions(List<query> conditions) {
		this.conditions = conditions;
	}
	
	
}
