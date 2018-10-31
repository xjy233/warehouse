package com.example.service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.List;

import com.example.module.Tb_jearecord;
import com.example.module.Tb_package;
import com.example.module.Tb_pacrecord;

public interface PacRecordService {
	public void add(Tb_pacrecord tb_pacrecord);//添加操作
	
	public void deleteById(int Id);//删除操作
	
	public Tb_pacrecord findByPacID(String packageId);//根据包裹ID查询
	 
	public void addOutTime(String pacID, Timestamp outTime, String outUser);//包裹出库更改出库时间
	
	//5.22
	public List<Tb_jearecord> InQueryTime(String time) throws ParseException;
	
	public List<Tb_jearecord> OutQueryTime(String time) throws ParseException;
	
	public List<String> InOutRecordQuerySet(List<Tb_package> packages, List<Tb_jearecord> pacrecordsName, List<Tb_jearecord> pacrecordsTime);
}
