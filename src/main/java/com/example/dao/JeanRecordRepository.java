package com.example.dao;

import java.sql.Timestamp;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_jearecord;


public interface JeanRecordRepository extends JpaRepository<Tb_jearecord, Integer>{
	//裤子出库添加现有数量，出库数量，出库时间和出库账户
	@Query(value = "update tb_jearecord set now_num=?2,out_num=?3,out_time=?4,out_username=?5 where jeansid=?1", nativeQuery = true)
	@Modifying
	@Transactional
	public void addTimeUser(int jeansid, int now_num,int outNum,Timestamp outTime, String outUser);
	
	//裤子出库误操作，更改裤子出库时间和出库账户
	@Query(value = "update tb_jearecord set out_time=null,out_username=null where jeansid=?1", nativeQuery = true)
	@Modifying
	@Transactional
	public void updateTimeUser(int jeansid);
	
	//根据裤子ID查询
	@Query(value = "select * from tb_jearecord where jeansid=?1", nativeQuery = true)  
	@Transactional
	public Tb_jearecord findByJeaID(int jeansid);
	
	//根据裤子ID删除
	@Query(value = "delete from tb_jearecord where jeansid=?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteByJeaID(int jeansid);
	
	//每个月入库信息
	@Query(value = "SELECT * FROM tb_jearecord WHERE in_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
	@Transactional
	List<Tb_jearecord> InAountMonth(Timestamp date1, Timestamp date2);
	
	//每个月出库信息
	@Query(value = "SELECT * FROM tb_jearecord WHERE out_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
	@Transactional
	List<Tb_jearecord> OutAountMonth(Timestamp date1, Timestamp date2);
	
	//每天入库
	@Query(value = "SELECT * FROM tb_jearecord WHERE in_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
	@Transactional
	List<Tb_jearecord> InAountDay(Timestamp date1, Timestamp date2);
	
	//每天出库
	@Query(value = "SELECT * FROM tb_jearecord WHERE out_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
	@Transactional
	List<Tb_jearecord> OutAountDay(Timestamp date1, Timestamp date2);

	//新加
	List<Tb_jearecord> findAll();
	
	List<Tb_jearecord> findByInUsername(String InUsername);
	
	List<Tb_jearecord> findByOutUsername(String OutUsername);
}
