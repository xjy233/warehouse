package com.example.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_jeans;


public interface JeansRepository extends JpaRepository<Tb_jeans, Integer>,JpaSpecificationExecutor<Tb_jeans>{
		//根据包裹ID查询
		@Query(value = "select * from tb_jeans where package_id=?1",nativeQuery = true)
		@Transactional
		public List<Tb_jeans> findByPackageId(String packageId);
		
		//根据裤子ID查询
		@Query(value = "select * from tb_jeans where module_num=?1",nativeQuery = true)
		@Transactional
		public List<Tb_jeans> findByModuleNum(String moduleNum);
				
		//根据裤子ID查询
		@Query(value = "select * from tb_jeans where jeansid=?1",nativeQuery = true)
		@Transactional
		public Tb_jeans findByJeansId(int jeansID);
		
		//根据包裹ID删除
		@Query(value = "delete from tb_jeans where package_id=?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteByPacID(String pacId);
		
		//获取新建数据的ID
		@Query(value = "select jeansid from tb_jeans where jeansid=(select last_insert_id())", nativeQuery = true)  
		@Transactional
		public int getNewId();
		
		//裤子出库更新裤子出库状态
		@Query(value = "update tb_jeans set station=?2 where jeansid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateStation(int Id, boolean station);
		
		//裤子出库更新裤子的现有数量
		@Query(value = "update tb_jeans set now_num=?2 where jeansid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateNowNum(int Id, int num);
		
		//包裹出库误操作，更新包裹状态
		@Query(value = "update tb_jeans set station=?2 where jeansid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void resetStation(int Id, boolean station);
		
		//给裤子加锁
		@Query(value = "update tb_jeans set lock_station=?2 where jeansid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void Lock(int Id, boolean station);
		//给裤子解锁
		@Query(value = "update tb_jeans set lock_station=?2 where jeansid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void unLock(int Id, boolean station);
		
		//锁表
		@Query(value = "lock table tb_package write,tb_jeans write,tb_pacrecord write,"
				+ "tb_position write,tb_jearecord write", nativeQuery = true)  
		@Modifying
		@Transactional
		public void lockTable();
		//解锁
		@Query(value = "unlock tables", nativeQuery = true)  
		@Modifying
		@Transactional
		public void unlockTable();
}
