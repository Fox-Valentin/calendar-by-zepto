   <?php
        for($i=0;$i<20;$i++){
            $data[$i]['date'] = "2016-5-".($i+1);
            $data[$i]['price'] = 35+$i;
        }
        echo json_encode($data);die;
        print_r($data);die;
?>