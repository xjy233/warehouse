package com.example.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.example.dao.JeansRepository;
import com.example.module.Tb_jeans;
import com.example.service.JeansService;

@Service
public class JeansServiceImpl implements JeansService{
	@Autowired
	private JeansRepository jeansRepository;
	
	@Override
	public void add(Tb_jeans tb_jeans) {
		jeansRepository.save(tb_jeans);
	}

	@Override
	public void deleteById(int Id) {
		jeansRepository.delete(Id);
	}

	@Override
	public List<Tb_jeans> findSearch(Tb_jeans tb_jeans) {
		Assert.notNull(tb_jeans);
	    List<Tb_jeans> result = jeansRepository.findAll(new Specification<Tb_jeans>() {
        @Override
        public Predicate toPredicate(Root<Tb_jeans> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
            List<Predicate> list = new ArrayList<Predicate>();
            if (tb_jeans.getModuleNum()!=null) {
                list.add(cb.equal(root.get("moduleNum").as(String.class),tb_jeans.getModuleNum()));
            }
            if (tb_jeans.getBrand()!=null) {
                list.add(cb.equal(root.get("brand").as(String.class),tb_jeans.getBrand()));
            }
            if (tb_jeans.getDepartment()!=null) {
                list.add(cb.equal(root.get("department").as(String.class),tb_jeans.getDepartment()));
            }
            if (tb_jeans.getProvider()!=null) {
                list.add(cb.equal(root.get("provider").as(String.class),tb_jeans.getProvider()));
            }
            if (tb_jeans.getFitting() != null) {
                list.add(cb.equal(root.get("fitting").as(String.class), tb_jeans.getFitting()));
            }
            if (tb_jeans.getColour()!=null) {
                list.add(cb.equal(root.get("colour").as(String.class),tb_jeans.getColour()));
            }
            if (tb_jeans.getSize() != null) {
                list.add(cb.equal(root.get("size").as(String.class), tb_jeans.getSize()));
            }
            
            Predicate[] p = new Predicate[list.size()];
            return cb.and(list.toArray(p));
        }
	    });
	    return result;
	}

	
	
}
