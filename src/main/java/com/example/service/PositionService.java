package com.example.service;

import java.util.List;

import com.example.module.Tb_position;

public interface PositionService {
	public void add(Tb_position tb_position);//添加操作
	
	public void deleteById(int Id);//删除操作
	
	public Tb_position findByPosInfo(String posInfo); //根据位子信息查询
	
	public void updateChangeTime(String position);//更改位子变动状态
	 
	public void updateAll(String positionInfo, int volume, int occupation, boolean stationOne,
                          boolean stationTwo);//更新所有信息操作
	
	public void updateIn(String positionInfo);//包裹入库更改位子使用信息
	
	public void updateOut(String positionInfo);//包裹出库更改位子使用信息
	
	public String smartStore();//返回智能推荐的位子信息
	
	public int[] backUsedInfo(String shelfNum);//返回货架的使用信息及总容量
	
	public List<Tb_position> backAllPos(String posNum);//查询对应货架号上的所有位子
	
	public String defaultPosition();//默认推荐位置（当智能推荐未找到时）
}
