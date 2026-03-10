package com.unicorn.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminColorStockItem {

    private String color;
    private String colorCode;
    private Integer stock;
}
