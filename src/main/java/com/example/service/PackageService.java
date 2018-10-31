package com.example.service;


import java.util.List;

import com.example.module.Tb_package;

public interface PackageService {
	public String add(Tb_package tb_package);//添加操作
	
	public void deleteById(int Id);//删除操作
	
	public Tb_package findBypackageID(String pacId); //根据包裹ID查询
	
	public void updateStation(String Id, int station);//包裹出库更新包裹状态
	
	public List<Tb_package> findByPosInfo(String positionInfo);//根据位子信息查询
	
	//去除list集合里的重复值
	public List<String> removeDuplicate(List<String> list);
}
