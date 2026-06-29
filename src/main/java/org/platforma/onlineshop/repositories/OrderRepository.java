package org.platforma.onlineshop.repositories;

import org.platforma.onlineshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
  Double getTotalRevenue();

  @Query(
      value = "SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.product.user.id = :sellerId",
      countQuery = "SELECT COUNT(DISTINCT o.id) FROM Order o JOIN o.orderItems oi WHERE oi.product.user.id = :sellerId")
  Page<Order> findOrdersBySellerId(Long sellerId, Pageable pageable);

  Page<Order> findByEmail(String email, Pageable pageable);
}
