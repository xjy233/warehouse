package com.example.service;

import java.util.List;

import com.example.module.Tb_jeans;

public interface JeansService {
	public void add(Tb_jeans tb_jeans);//添加操作
	
	public void deleteById(int Id);//删除操作
	
	public List<Tb_jeans> findSearch(Tb_jeans tb_jeans);
	//根据供应商，款式，颜色，尺寸查询
	//todo
}
