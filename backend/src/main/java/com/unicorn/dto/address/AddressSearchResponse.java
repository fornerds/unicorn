package com.unicorn.dto.address;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressSearchResponse {

    private String zipCode;
    private String roadAddress;
    private String jibunAddress;
}
