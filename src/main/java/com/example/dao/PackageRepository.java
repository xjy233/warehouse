package com.example.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_package;


public interface PackageRepository extends JpaRepository<Tb_package, Integer>{
	
		//根据包裹ID查询
		@Query(value = "select * from tb_package where packageid=?1", nativeQuery = true)  
		@Transactional
		public Tb_package findBypackageID(String packageID);
		
		//根据包裹ID删除
		@Query(value = "delete from tb_package where packageid=?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteByPacID(String pacId);
		
		//给包裹添加包裹ID
		@Query(value = "update tb_package set packageid=?2 where id=?1", nativeQuery = true)  
		@Modifying
		@Transactional
		public void addPacID(int id, String pacID);
		
		//获取新建数据的ID
		@Query(value = "select id from tb_package where id=(select last_insert_id())", nativeQuery = true)  
		@Transactional
		public int getNewId();
		
		//包裹出库更新包裹状态
		@Query(value = "update tb_package set if_out=?2 where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateStation(String Id, int station);
		
		//裤子出库更新裤子的现有数量
		@Query(value = "update tb_package set now_num=?2 where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateNowNum(String Id, int num);
		
		//包裹出库误操作，更新包裹状态
		@Query(value = "update tb_package set if_out=?2 where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void resetStation(String Id, int station);
		
		//返回所有问题包裹
		@Query(value = "select * from tb_package where if_problem=?1", nativeQuery = true)
		@Transactional
		public List<Tb_package> backProPac(boolean station);
		
		//根据位子信息查询
		@Query(value = "select * from tb_package where position_info=?1", nativeQuery = true)  
		@Transactional
		public List<Tb_package> findByPosInfo(String positionInfo);
		
		//包裹移动，更改包裹位子信息
		@Query(value = "update tb_package set position_info=?2 where packageid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void setPosition(String pacId, String positinInfo);
		
		//第二种根据位子信息查询
		public List<Tb_package> findByPositionInfo(String positionInfo);
}
