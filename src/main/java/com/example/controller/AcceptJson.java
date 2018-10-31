package com.example.controller;


public class AcceptJson {
	
	
	//测试
//	public static void main(String[] args) {
//		float a = (float) 100.005;
//		System.out.println(a);
//	}
	public String[] JsonToString(String json){
		String str1 = json.replace("{","");
		String str2 = str1.replace("}", "");
		String str3 = str2.replace("[", "");
		String str4 = str3.replace("]", "");
		String str5 = str4.replace("\"", "");
		System.out.println(str5);
		String[] data = str5.split(",");
		
		return data;
	}
	
}
