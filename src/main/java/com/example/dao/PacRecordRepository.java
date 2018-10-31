package com.example.dao;

import java.sql.Timestamp;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_jearecord;
import com.example.module.Tb_pacrecord;

public interface PacRecordRepository extends JpaRepository<Tb_pacrecord, Integer>{
	
		//包裹出库添加出库时间和出库账户
		@Query(value = "update tb_pacrecord set out_time=?2,out_username=?3 where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void addTimeUser(String pacId, Timestamp outTime, String outUser);
		
		//包裹出库误操作，更改包裹出库时间和出库账户
		@Query(value = "update tb_pacrecord set out_time=null,out_username=null where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateTimeUser(String pacId);
		
		//根据包裹ID查询
		@Query(value = "select * from tb_pacrecord where packageid=?1", nativeQuery = true)  
		@Transactional
		public Tb_pacrecord findByPacID(String packageId);
		
		//根据包裹ID删除
		@Query(value = "delete from tb_pacrecord where packageid=?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteByPacID(String pacId);
		
		//新加出入库
		List<Tb_pacrecord> findByInUsername(String inUsername);
		
		List<Tb_pacrecord> findByOutUsername(String outUsername);
		
		List<Tb_pacrecord> findAll();
		
		//当天出库
		@Query(value = "SELECT * FROM tb_pacrecord WHERE out_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
		@Transactional
		List<Tb_pacrecord> OutAountDay(Timestamp date1, Timestamp date2);
		
		//当天入库
		@Query(value = "SELECT * FROM tb_pacrecord WHERE int_time BETWEEN ?1 AND ?2 ", nativeQuery = true)
		@Transactional
		List<Tb_pacrecord> InAountDay(Timestamp date1, Timestamp date2);
}
