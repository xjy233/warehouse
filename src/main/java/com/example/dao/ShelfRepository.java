package com.example.dao;


import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_shelf;


public interface ShelfRepository extends JpaRepository<Tb_shelf, Integer>{
		
		//更新操作 
		@Query(value = "update tb_shelf set shelf_row=?2,shelf_col=?3,shelf_number=?4 where shelfid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void update(int shelfID, int shelfRow, int shelfCol, String shelfNumber);
		
		//根据货架号查询
		@Query(value = "select * from tb_shelf where shelf_number=?1", nativeQuery = true)
		@Transactional
		public Tb_shelf findByShelfNum(String shelfNumber);
		
	    //根据ID更新货架列数
		@Query(value = "update tb_shelf set shelf_col=?2 where shelfid=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void updateCol(int shelfID, int col);
		
		//获取表中最大Id号
		@Query(value = "select shelfid from tb_shelf where shelfid=(select max(shelfid) from tb_shelf)", nativeQuery = true)  
		@Transactional
		public int getMaxId();
		
		//根据货架号删除
		@Query(value = "delete from tb_shelf where shelf_number=?1", nativeQuery = true)
		@Modifying
		@Transactional
		public void deleteByShelfNum(String shelfNum);
}
