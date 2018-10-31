package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_size;


public interface SizeRepository extends JpaRepository<Tb_size, Integer>{
		
		
		//根据尺寸信息进行删除
		@Query(value = "delete from tb_size where size_info =?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteBysize(String sizeInfo);

	   
	   
}
