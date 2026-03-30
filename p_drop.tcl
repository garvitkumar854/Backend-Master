# Create Simulator 
set ns [new Simulator] 

# Trace file 
set tf [open out.tr w] 
$ns trace-all $tf 

# NAM file 
set nf [open out.nam w] 
$ns namtrace-all $nf

# Create nodes 
set n0 [$ns node] 
set n1 [$ns node] 
set n2 [$ns node] 

# Create links (bottleneck link with low bandwidth) 
$ns duplex-link $n0 $n1 1Mb 10ms DropTail 
$ns duplex-link $n1 $n2 0.3Mb 20ms DropTail 

# UDP Agent (Sender) 
set udp [new Agent/UDP] 
$ns attach-agent $n0 $udp 

# Null Agent (Receiver) 
set null [new Agent/Null] 
$ns attach-agent $n2 $null 

# Connect agents 
$ns connect $udp $null 

# CBR Traffic (High rate to create congestion) 
set cbr [new Application/Traffic/CBR] 
$cbr attach-agent $udp 
$cbr set packetSize_ 1000 
$cbr set interval_ 0.005   ;# high traffic 

# Start & Stop 
$ns at 1.0 "$cbr start" 
$ns at 4.0 "$cbr stop" 

# Finish 
proc finish {} { 
global ns tf nf 
$ns flush-trace 
close $tf 
close $nf 
exec nam out.nam & 
exit 0 
} 
$ns at 5.0 "finish" 

# Run simulation 
$ns run