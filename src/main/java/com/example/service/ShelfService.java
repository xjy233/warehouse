package com.example.service;

import java.util.List;

import com.example.module.Tb_shelf;

public interface ShelfService {
	public void add(Tb_shelf tb_shelf);//添加操作
	
	public void deleteById(int Id);//删除操作
	
	public Tb_shelf findById(int Id); //根据ID查询
	
	public void updateCol(int shelfId, int col);//根据货架号增加列数
	
	public List<String> sortShelfNum();//根据货架号排序
}
