package com.example.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_position;

public interface PositionRepository extends JpaRepository<Tb_position, Integer>{
		//根据位子信息查询
		@Query(value = "select * from tb_position where position_Info=?1", nativeQuery = true)
		@Transactional
		public Tb_position findBypositionInfo(String positionInfo);
		
		//更新所有信息操作 
		@Query(value = "update tb_position set volum=?3,occupation=?4,stationOne=?5,stationTwo=?6 where positionInfo=?2", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateAll(String positionInfo, int volume, int occupation, boolean stationOne, boolean stationTwo);
		
		//包裹入库更改位子使用信息
		@Query(value = "update tb_position set occupation=occupation+1 where position_Info=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateIn(String positionInfo);
		
		//包裹出库更改位子使用信息
		@Query(value = "update tb_position set occupation=occupation-1 where position_Info=?1 and occupation>0", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateOut(String positionInfo);
		
		//包裹出入库更改位子状态
		@Query(value = "update tb_position set change_time=?2 where position_Info=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateChangeTime(String positionInfo, String changeTime);
		
		//查询满足剩余量>20的位子
		@Query(value = "select * from tb_position where volume-occupation>20 ", nativeQuery = true)  
		@Transactional
		public List<Tb_position> smartStore();
		
		//查询对应货架号上的所有位子
		@Query(value = "select * from tb_position where substring(position_info,1,2)=?1", nativeQuery = true)  
		@Transactional
		public List<Tb_position> backAllPos(String posNum);
		
}
